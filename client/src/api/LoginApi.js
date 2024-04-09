export async function serverGetToken(googleId, imageUrl, email, name, givenName, familyName) {
    const data = {
        googleId: googleId,
        imageUrl: imageUrl,
        email: email,
        name: name,
        givenName: givenName,
        familyName: familyName
    };
    const res = await fetch('http://localhost:12345/Login', {
        'method': 'post',
        'headers': {
            'Content-Type': 'application/json',
        },
        'body': JSON.stringify(data)
    })

    if (!res.ok) {
        return "";
    }

    const token = await res.text()
    return token;
}