$(document).ready(function() {
	let JSON_DATA = null;
	let tindex = 0;
	const TB_PRODUCTS = $('#products-tbody');
	const TB_PRODUCT_COUNT = $('#product-count');
	const SEARCH_BAR = $('#search');

	$.ajax({
		url: '../data/data.txt',
		success: function(data) {
			JSON_DATA = JSON.parse(data);
			showAllProducts();
		  	// $('#data-output').text(JSON.stringify(JSON_DATA));
		}
	});

	function createProductHTML(productObj) {
		return `
			<tr class="product"><th scope="row">${++tindex}</th>
			<td class="product-name">${
				(productObj.name != null)
				? productObj.name : "Não especificado"
			}</td>
			<td>${
				(productObj.category != null)
				? productObj.category : "Não especificado"
			}</td>
			<td>${
				(productObj.brand != null)
				? productObj.brand : "Não especificado"
			}</td>
			<td>${
				(productObj.details != null)
				? productObj.details : "Não especificado"
			}</td>
			<td>${
				(productObj.measure != null)
				? productObj.measure : "Não especificado"
			}</td>
			<td data-price="${
				(productObj.price != null)
				? productObj.price
				: 0
			}" class="product-price">${
				(productObj.price != null)
				? productObj.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
				: "Não especificado"
			}</td>
		`
	}

	$('input[type="checkbox"]').on('click', function() {
		showFilteredProducts();

		if ($(this)[0].id == "cart-checkbox" && $(this)[0].checked == true) {
			$('.cart-column').removeClass('d-none')
		} else if ($(this)[0].id == "cart-checkbox") {
			$('.cart-column').addClass('d-none')
			$('#cart-products').html('');
			$('#cart-footer').html('');
		}

		if ($('input[type="checkbox"]:not(#cart-checkbox):checked').length === 0) {
			this.checked = true;
		}
	});

	function addAddToCartEventListener() {
		$('.product').on('click', function() {

			if ($('input#cart-checkbox:checked').length === 1) {
				const CART_PRODUCTS = $('#cart-products');
								
				CART_PRODUCTS.html(CART_PRODUCTS.html() + 
				`
				<tr>
					<th contenteditable="true" scope="row">1</th>
					<td>${$(this)[0].querySelector(".product-name").innerText}</td>
					<td data-price="${
						$(this)[0].querySelector('.product-price').dataset.price
					}" class="product-price">${$(this)[0].querySelector('.product-price').innerText}</td>
				</tr>
				`);

				let productsAmount = 0;
				let totalPrice = 0;

				CART_PRODUCTS[0].querySelectorAll("tr").forEach( product => {
					productsAmount += Number(product.querySelector("th").innerText)
				})

				CART_PRODUCTS[0].querySelectorAll("tr").forEach( product => {
					totalPrice += Number(product.querySelector("td.product-price").dataset.price)
				})

				$('#cart-footer').html(`
					<tr>
						<td>${productsAmount}</td>
						<td></td>
						<td>${totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
					</tr>
				`)
			}
		});
	}

	function showAllProducts() {
		JSON_DATA.forEach(product => TB_PRODUCTS.html(TB_PRODUCTS.html() + createProductHTML(product)))
		TB_PRODUCT_COUNT.text(tindex);
		addAddToCartEventListener()
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
		addAddToCartEventListener()
	}

	SEARCH_BAR.on('input', function (e) { 
		e.preventDefault();
		showFilteredProducts();
	});
})