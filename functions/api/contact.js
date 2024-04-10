export async function onRequest(context) {
    const {
        request, // same as existing Worker API
        env, // same as existing Worker API
        params, // if filename includes [id] or [[path]]
        waitUntil, // same as ctx.waitUntil in existing Worker API
        next, // used for middleware or to fetch assets
        data, // arbitrary space for passing data between middlewares
    } = context;

    try {
        const res = await readRequestBody(request);
        const body = typeof res === 'string' ? JSON.parse(res) : res;
        const bodyVars = Object.keys(body).map(key => `${key}: ${body[key]}`);
        const TextPart = `${body.first_ame} said: \n\n ${bodyVars.join('\n')}`;
        const HTMLPart = `<h1>${body.first_ame} said:</h1><p>${bodyVars.join('<br />')}</p>`;

        await fetch('https://api.mailjet.com/v3.1/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa(`${env.MAILJET_API_KEY}:${env.MAILJET_API_SECRET}`)
            },
            body: JSON.stringify({
                'Messages': [
                    {
                        'From': {
                            'Email': env.EMAIL_FROM,
                            'Name': env.EMAIL_NAME
                        },
                        'To': [
                            {
                                'Email': env.EMAIL_TO,
                                'Name': env.EMAIL_TO_NAME
                            }
                        ],
                        'Subject': `New Contact from ${body.firstName} ${body.lastName}`,
                        TextPart,
                        HTMLPart
                    }
                ]
            })
        });
    }
    catch (e) {
        console.log(e);

        return new Response(JSON.stringify({success: false, error: e.message}), {
            headers: {
                "content-type": "application/json;charset=UTF-8",
            },
        });
    }



    return new Response(JSON.stringify({success: true}), {
        headers: {
            "content-type": "application/json;charset=UTF-8",
        },
    });
}


async function readRequestBody(request) {
    const contentType = request.headers.get("content-type");
    if (contentType.includes("application/json")) {
        return JSON.stringify(await request.json());
    } else if (contentType.includes("application/text")) {
        return request.text();
    } else if (contentType.includes("text/html")) {
        return request.text();
    } else if (contentType.includes("form")) {
        const formData = await request.formData();
        const body = {};
        for (const entry of formData.entries()) {
            body[entry[0]] = entry[1];
        }
        return JSON.stringify(body);
    } else {
        // Perhaps some other type of data was submitted in the form
        // like an image, or some other binary data.
        return "a file";
    }
}
