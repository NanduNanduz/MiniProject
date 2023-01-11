function addToCart(productId) {
    $.ajax({
      url: '/addToCart?id=' + productId,
      method: 'GET',
      success: function (response) {
        if (response.status) {
          Swal.fire({
            position: 'centre',
            icon: 'success',
            title: 'Product is added to the cart',
            showConfirmButton: false,
            timer: 1500,
          });
          let count = $('#cart-count').html();
          count = parseInt(count) + 1;
          $('#cart-count').html(count);
        } else {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Please LOGIN',
            showConfirmButton: false,
            timer: 1500,
          });
        }
      },
    });
  }
  
  function addToWishlist(productId) {
    $.ajax({
      url: '/add-to-wishlist?id=' + productId,
      method: 'get',
      success: (response) => {
        if (response.status) {
          Swal.fire({
            position: 'centre',
            icon: 'success',
            title: 'Success',
            showConfirmButton: false,
            timer: 1500,
          });
          let count = $('#wish-count').html();
          count = parseInt(count);
          $('#wish-count').html(count);
        } else {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Please LOGIN',
            showConfirmButton: false,
            timer: 1500,
          });
        }
      },
    });
  }
  
  function addToCartDeleteWish(productId) {
    $.ajax({
      url: '/add-to-cart-delete-wishlist?id=' + productId,
      method: 'get',
      success: (response) => {
        if (response.status) {
          Swal.fire({
            position: 'centre',
            icon: 'success',
            title: 'Success',
            showConfirmButton: false,
            timer: 1500,
          });
          let count = $('#wish-count').html();
          $('#wish-count').reload(location.href + ' #wish-count');
          count = parseInt(count);
          $('#wish-count').html(count);
        } else {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Please LOGIN',
            showConfirmButton: false,
            timer: 1500,
          });
        }
      },
    });
  }
  
  $(document).ready(function () {
    // function RefreshTable() {
    //     $( "#mytable" ).load( "your-current-page.html #mytable" );
    // }
  
    // $("#refresh-btn").on("click", RefreshTable);
  
    // OR CAN THIS WAY
    //
    $('#refresh-btn').on(
      'click',
      function () {
        $('#mytable').load(location.href + ' #mytable');
      },
      200
    );
  });
  
  // Button
  $(function () {
    $('[data-decrease]').click(decrease);
    $('[data-increase]').click(increase);
    $('[data-value]').change(valueChange);
  });
  
  function decrease() {
    var value = $(this).parent().find('[data-value]').val();
    if (value > 1) {
      value--;
      $(this).parent().find('[data-value]').val(value);
    }
  }
  
  function increase() {
    var value = $(this).parent().find('[data-value]').val();
    if (value < 100) {
      value++;
      $(this).parent().find('[data-value]').val(value);
    }
  }
  
  function valueChange() {
    var value = $(this).val();
    if (value == undefined || isNaN(value) == true || value <= 0) {
      $(this).val(1);
    } else if (value >= 101) {
      $(this).val(100);
    }
  }
  