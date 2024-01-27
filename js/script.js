let JSON_DATA = null;
let tindex = 0;
const TB_PRODUCTS = $('#products-tbody');
const TB_PRODUCT_COUNT = $('#product-count');
const SEARCH_BAR = $('#search');

$.ajax({
	url: '../data/data.json',
	success: function (data) {
		JSON_DATA = JSON.parse(data);
		showAllProducts();
		// $('#data-output').text(JSON.stringify(JSON_DATA));
	}
});

function createProductHTML(productObj) {
	const NAME = (productObj.name != null) ? productObj.name : "Não especificado";
	const CATEGORY = (productObj.category != null) ? productObj.category : "Não especificado";
	const BRAND = (productObj.brand != null) ? productObj.brand : "Não especificado";
	const DETAILS = (productObj.details != null) ? productObj.details : "Não especificado";
	const MEASURE = (productObj.measure != null) ? productObj.measure : "Não especificado";
	const PRICE = (productObj.price != null) ? productObj.price : 0;
	const FORMATED_PRICE = (productObj.price != null) ? PRICE.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : "Não especificado";

	return `
			<tr class="product"><th scope="row">${++tindex}</th>
			<td class="product-name">${NAME}</td>
			<td>${CATEGORY}</td>
			<td>${BRAND}</td>
			<td>${DETAILS}</td>
			<td>${MEASURE}</td>
			<td data-price="${PRICE}" class="product-price">${FORMATED_PRICE}</td>
		`
}

$('input[type="checkbox"]').on('click', function () {
	showFilteredProducts();
	const IS_CART_CHECKBOX = $(this)[0].id == "cart-checkbox";
	const IS_CHECKED = $(this)[0].checked == true;

	if (IS_CART_CHECKBOX)
		if (IS_CHECKED)
			$('.cart-column').removeClass('d-none')
		else {
			$('.cart-column').addClass('d-none')
			$('#cart-products').html('');
			$('#cart-footer').html('');
		}

	const FILTER_CHECKBOXES_UNCHECKED = $('input[type="checkbox"]:not(#cart-checkbox):checked').length === 0;
	if (FILTER_CHECKBOXES_UNCHECKED) this.checked = true;
});

function AddToCartEventListener() {
	$('.product').on('click', function () {

		if ($('input#cart-checkbox:checked').length === 1) {
			const CART_PRODUCTS = $('#cart-products');
			const PRODUCT_NAME = $(this)[0].querySelector(".product-name").innerText;
			const PRODUCT_PRICE = $(this)[0].querySelector('.product-price').dataset.price;
			const PRODUCT_PRICE_FORMATED = $(this)[0].querySelector('.product-price').innerText;

			CART_PRODUCTS.html(CART_PRODUCTS.html() +
				`
				<tr>
					<th class="product-amount" contenteditable="true" scope="row">1</th>
					<td>${PRODUCT_NAME}</td>
					<td data-price="${PRODUCT_PRICE}" class="product-price">${PRODUCT_PRICE_FORMATED}</td>
				</tr>
				`);

			let productsAmount = 0;
			let totalPrice = 0;

			CART_PRODUCTS[0].querySelectorAll("tr").forEach(product => {
				productsAmount += Number(product.querySelector("th").innerText)
			})

			CART_PRODUCTS[0].querySelectorAll("tr").forEach(product => {
				const PRODUCT_PRICE = Number(product.querySelector("td.product-price").dataset.price);
				const PRODUCT_AMOUNT = Number(product.querySelector("th.product-amount").innerText);
				totalPrice += PRODUCT_PRICE * PRODUCT_AMOUNT;
			})

			const TOTAL_PRICE_FORMATED = totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

			$('#cart-footer').html(`
					<tr style="color: red;">
						<td><strong>${productsAmount}</strong></td>
						<td></td>
						<td><strong>${TOTAL_PRICE_FORMATED}</strong></td>
					</tr>
				`)
		}
	});
}

function showAllProducts() {
	JSON_DATA.forEach(product => TB_PRODUCTS.html(TB_PRODUCTS.html() + createProductHTML(product)))
	TB_PRODUCT_COUNT.text(tindex);
	AddToCartEventListener()
}

function showFilteredProducts() {
	TB_PRODUCTS.html('');
	tindex = 0;


	if (SEARCH_BAR.val() === '') {
		showAllProducts()
		return
	}

	JSON_DATA.forEach(product => {
		const NAMES_MATCH = (product.name != null) ? product.name.toLowerCase().includes(SEARCH_BAR.val().toLowerCase()) : false;
		const CATEGORIES_MATCH = (product.category != null) ? product.category.toLowerCase().includes(SEARCH_BAR.val().toLowerCase()) : false;
		const BRANDS_MATCH = (product.brand != null) ? product.brand.toLowerCase().includes(SEARCH_BAR.val().toLowerCase()) : false;
		const DETAILS_MATCH = (product.details != null) ? product.details.toLowerCase().includes(SEARCH_BAR.val().toLowerCase()) : false;

		if ($('input#name-search-checkbox:checked').length === 1)
			if (NAMES_MATCH) return TB_PRODUCTS.html(TB_PRODUCTS.html() + createProductHTML(product))

		if ($('input#category-search-checkbox:checked').length === 1)
			if (CATEGORIES_MATCH) return TB_PRODUCTS.html(TB_PRODUCTS.html() + createProductHTML(product))

		if ($('input#brand-search-checkbox:checked').length === 1)
			if (BRANDS_MATCH) return TB_PRODUCTS.html(TB_PRODUCTS.html() + createProductHTML(product))

		if ($('input#details-search-checkbox:checked').length === 1)
			if (DETAILS_MATCH) return TB_PRODUCTS.html(TB_PRODUCTS.html() + createProductHTML(product))

	})

	TB_PRODUCT_COUNT.text(tindex)
	AddToCartEventListener()
}

SEARCH_BAR.on('input', function (e) {
	e.preventDefault();
	showFilteredProducts();
});