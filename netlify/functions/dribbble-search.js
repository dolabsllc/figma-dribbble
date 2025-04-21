// Función serverless para buscar en Dribbble
exports.handler = async function(event, context) {
  // Habilitar CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  // Obtener el parámetro de búsqueda
  const query = event.queryStringParameters?.query;
  if (!query) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Se requiere un parámetro de consulta' })
    };
  }

  try {
    // Obtener token de Dribbble
    const tokenUrl = 'https://dribbble.com/oauth/token';
    const tokenOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: '806d44da21888313d538a5c7dc8392945ae88357349afd103b02c6da04c00944',
        client_secret: '46a38aa7fa7464885634f84cf0868f8d352b163e3954bc8dd06bb75861be26d8',
        grant_type: 'client_credentials'
      })
    };

    const tokenResponse = await fetch(tokenUrl, tokenOptions);
    if (!tokenResponse.ok) {
      throw new Error('Error al obtener el token de acceso');
    }
    
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Buscar en Dribbble
    const searchUrl = `https://api.dribbble.com/v2/shots?q=${encodeURIComponent(query)}&per_page=20`;
    const searchOptions = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    };

    const searchResponse = await fetch(searchUrl, searchOptions);
    if (!searchResponse.ok) {
      throw new Error('Error al buscar en Dribbble');
    }
    
    const shots = await searchResponse.json();

    // Devolver resultados
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        shots,
        query
      })
    };
  } catch (error) {
    console.log('Error:', error.message);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Error en la búsqueda: ' + error.message })
    };
  }
};
