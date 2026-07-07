export async function fetch_organization_profile() {
    const token = localStorage.getItem('access');
    const response = await fetch('http://127.0.0.1:8000/api/organization/profile/', {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const err = await response.json();
        throw err;
    }
    return response.json();
}