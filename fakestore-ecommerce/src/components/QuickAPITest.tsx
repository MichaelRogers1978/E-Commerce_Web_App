import { fetchAllProducts } from '../api/fakestore';

const QuickAPITest = () => {
  const testFakeStoreAPI = async () => {
    try {
      console.log('Testing FakeStore API...');
      const products = await fetchAllProducts();
      console.log('API Success! Products:', products);
      alert(`API Working! Fetched ${products.length} products`);
    } catch (error) {
      console.error('API Error:', error);
      alert('API Error - Check console for details');
    }
  };

  return (
    <button 
      onClick = {testFakeStoreAPI}
      className = "button"
      style = {{ 
        backgroundColor: '#007bff', 
        color: 'white',
        margin: '1rem'
      }}
    >
      Test FakeStore API
    </button>
  );
};

export default QuickAPITest;