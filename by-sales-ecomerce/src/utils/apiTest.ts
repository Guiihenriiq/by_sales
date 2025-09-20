export const testWishlistAPI = async (token: string) => {
  try {
    console.log('Testing wishlist API with token:', token?.substring(0, 20) + '...');
    
    const response = await fetch('http://localhost:3334/api/wishlist', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return { success: false, error: errorText };
    }
    
    const data = await response.json();
    console.log('Success response:', data);
    return { success: true, data };
    
  } catch (error) {
    console.error('Network error:', error);
    return { success: false, error: error };
  }
};