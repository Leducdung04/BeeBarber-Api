fetch("/api/get_all/product")
  .then((response) => response.json())
  .then((data) => {
    const productListHTML = data.data
      .map(
        (product) => `
    <div class="col-lg-3 mb-4 text-center">
      <div class="product-entry border">
        <a href="#" class="prod-img">
          <img src="${product.imageUrl}" class="img-fluid" alt="Fstyle shop">
        </a>
        <div class="desc">
          <h2><a href="#">${product.name}</a></h2>
          <span class="price">${product.price_selling.toLocaleString()} VNĐ</span>
        </div>
      </div>
    </div>
    `
      )
      .join("");

    document.getElementById("product-list-container").innerHTML = productListHTML;
  })
  .catch((error) => console.error("Error fetching products:", error));
