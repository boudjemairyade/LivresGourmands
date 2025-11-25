const axios = require('axios');

async function testRegister() {
  try {
    console.log(' Test d\'inscription...\n');
    
    const testData = {
      nom: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'test123456'
    };
    
    console.log(' Données envoyées:', testData);
    
    const response = await axios.post('http://localhost:3000/api/auth/register', testData);
    
    console.log(' Réponse du serveur:');
    console.log(JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error(' Erreur lors du test:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Données:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.error('Pas de réponse du serveur. Le serveur est-il démarré?');
    } else {
      console.error('Erreur:', error.message);
    }
  }
}

testRegister();

