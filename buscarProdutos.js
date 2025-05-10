require('dotenv').config();
const axios = require('axios');

async function buscarProdutos(termo) {
  const url = `https://api.mercadolibre.com/sites/MLB/search?q=${encodeURIComponent(termo)}`;
  try {
    const response = await axios.get(url);

    const resultados = response.data.results.slice(0, 3).map(produto => ({
      titulo: produto.title,
      preco: produto.price,
      link: produto.permalink,
      categoria_id: produto.category_id,
      condicao: produto.condition,
      vendedor: produto.seller && produto.seller.id ? produto.seller.id : null,
    }));

    console.log(JSON.stringify(resultados, null, 2));
    return resultados;
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    return [];
  }
}

// Exemplo de uso:
buscarProdutos('bicicleta eletrica 750W'); 