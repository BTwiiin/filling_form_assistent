const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

async function get(url: string) {
    const requestOptions = {
        method: 'GET',
        headers: await getHeaders(),
        credentials: 'include' as const
    }

    const response = await fetch(baseUrl + url, requestOptions);
    return handleResponse(response);
}

async function post(url: string, body: object) {
    const requestOptions = {
        method: 'POST',
        headers: await getHeaders(),
        credentials: 'include' as const,
        body: JSON.stringify(body)
    }

    const response = await fetch(baseUrl + url, requestOptions);
    return handleResponse(response);
}

async function getHeaders() {
    return {
        'Content-Type': 'application/json',
    };
}

async function handleResponse(response: Response) {
    const text = await response.text();
    
    // Check if the response is valid JSON
    let data;
    try {
        data = text && JSON.parse(text);
    } catch (error) {
        console.error('Error parsing response as JSON:', error);
        data = { message: text };
    }

    if (response.ok) {
        return data;
    }

    // Handle specific error cases
    if (response.status === 401) {
        // Handle unauthorized access
        console.error('Unauthorized access');
        return { error: { status: 401, message: 'Unauthorized access' } };
    }

    return {
        error: {
            status: response.status,
            message: data.message || response.statusText
        }
    };
}

export const fetchWrapper = {
    get,
    post
}; 