function ValidarAcceso () {
  $(document).on('pagebeforechange', function(e, data){  
                var to = data.toPage,
                    from = data.options.fromPage;
                 
                if (typeof to  === 'string') {
                    var u = $.mobile.path.parseUrl(to);
                    to = u.hash || '#' + u.pathname.substring(1);
                    if (from) from = '#' + from.attr('id');
                    if (from === '#login' && to === '#menuPrincipal'&& document.getElementById("valorValidar").value == "0") {
                        alert('Debe iniciar sesión');
                        e.preventDefault();
                        e.stopPropagation();
                         location.href = "#";
                        // remove active status on a button if a transition was triggered with a button
                        $.mobile.activePage.find('.ui-btn-active').removeClass('ui-btn-active ui-shadow').css({'box-shadow':'0 0 0 #3388CC'});
                    } 
                    if (from === '#login' && to === '#pedido') {
                        alert('Debe iniciar sesión');
                        e.preventDefault();
                        e.stopPropagation();
                         location.href = "#";
                        // remove active status on a button if a transition was triggered with a button
                        $.mobile.activePage.find('.ui-btn-active').removeClass('ui-btn-active ui-shadow').css({'box-shadow':'0 0 0 #3388CC'});
                    } 
                    if (from === '#login' && to === '#adminUsuario') {
                        alert('Debe iniciar sesión');
                        e.preventDefault();
                        e.stopPropagation();
                         location.href = "#";
                        // remove active status on a button if a transition was triggered with a button
                        $.mobile.activePage.find('.ui-btn-active').removeClass('ui-btn-active ui-shadow').css({'box-shadow':'0 0 0 #3388CC'});
                    }
                }
            });
}



function AgregarCliente(){
  var nombre = document.getElementById("txtNombre").value;
  var apellidos = document.getElementById("txtApellidos").value;
  var correo = document.getElementById("txtCorreoNuevo").value;
  var dir = document.getElementById("txtDireccion").value;
  var pass = document.getElementById("txtContraseñaNueva").value;
  
  if(nombre !== "" && apellidos !== "" && correo !== "" && dir !== "" && pass !== ""){
      var req = $.ajax({
          url: 'http://ws-restaurante-udata.azurewebsites.net/WSUsuario.svc/AgregarUsuario?correo='+ correo + '&nombre=' + nombre + '&apellidos=' + apellidos + '&direccion=' + dir + '&contraseña='+ pass,
          dataType:"jsonp",
          timeout: 10000
      });


       document.getElementById("txtCorreo").value = correo;
       document.getElementById("txtPass").value = "";


        document.getElementById("txtNombre").value = "";
        document.getElementById("txtApellidos").value = "";
        document.getElementById("txtCorreoNuevo").value = "";
        document.getElementById("txtDireccion").value = "";
        document.getElementById("txtContraseñaNueva").value = "";


        $('#mensajeError').html("Se ha registrado exitosamente");
        location.href = "#";
  }else{
    $('#mensajeError').html("Debe completar los datos");
    location.href = "#";
  }
}


function ValidarCorreo(){
  var correo = document.getElementById("txtCorreo").value;
  var pass = document.getElementById("txtPass").value;
  var req = $.ajax({
      url: 'http://ws-restaurante-udata.azurewebsites.net/WSUsuario.svc/UsuarioLogin?correo=' + correo + '&contraseña=' + pass,
      dataType:"jsonp",
      timeout: 10000,
      success: function(datos){ProcesarValidacion(datos)}
  });
}

function ProcesarValidacion(datos){
    if(datos == null){
      $('#mensajeError').html("El correo electrónico que ingresaste no coinciden con ninguna cuenta. <a id='llamarAlPopup' href='#popupRegistrar' data-rel='popup' data-position-to='window' data-transition='pop'>Regístrate para crear una cuenta.</a>");
    }else{
      if(!datos.Activo){
          document.getElementById("valorValidar").value = "0";
          $('#mensajeError').html("Este usuario ha sido bloqueado, por favor contacte al administrador");
      }else if(datos.Activo && datos.TipoUsuario.Descripcion == "Cliente"){
          document.getElementById("valorValidar").value = "1";
          localStorage.setItem("cliente",JSON.stringify(datos));
          CargarPlatos();
          location.href = "#menuPrincipal";
      }else{
          document.getElementById("valorValidar").value = "0";
          $('#mensajeError').html("No tiene permisos para acceder");
      }
    }
}








function CargarPlatos(){
  sessionStorage.clear();
    var req = $.ajax({
        url: 'http://ws-restaurante-udata.azurewebsites.net/WSPlatos.svc/ListarPlatos',
        dataType: 'jsonp',
        timeout: 10000,
        success: function(datos){ProcesarPlatos(datos)}
    });
}

function ProcesarPlatos(datos){
  sessionStorage.clear();
    $('#listaPlatos').empty();
    $.each(datos, function(){
      
      var nuevoLi = document.createElement("li");
      nuevoLi.setAttribute("id", this.IdPlato);
      nuevoLi.setAttribute("onclick", "VerDetalle(this.id)");
      var nuevoA = document.createElement("a");
      nuevoA.href= "#popupRegistrar2";
      nuevoA.setAttribute("data-rel", "popup");
      nuevoA.setAttribute("data-position-to", "window");
      nuevoA.setAttribute("data-transition", "slidedown");
      nuevoA.setAttribute("class","platosPedidos");
      nuevoA.innerHTML = this.Nombre + " " + this.Precio;
      nuevoLi.appendChild(nuevoA);

       $('#listaPlatos').append(nuevoLi);
       //esto es para pruebas
       
    });

    $(".platosPedidos").removeClass("ui-btn ui-btn-icon-right ui-icon-carat-r");
    $(".platosPedidos").addClass("ui-btn ui-btn-icon-right ui-icon-plus");
    $('#listaPlatos').listview('refresh');
}

function VerDetalle(id){
  /** metodo importante!!!

  len = sessionStorage.length;
  for (var i = 0; i < len; i++) {
    key = sessionStorage.key(i);  
    val = sessionStorage.getItem(key);
    }
  **/

  var req = $.ajax({
    url: 'http://ws-restaurante-udata.azurewebsites.net/WSPlatos.svc/InfoPlatoPorId?id=' + id,
    dataType: 'jsonp',
    timeout: 10000,
    success: function(datos){ProcesarDetalles(datos)}
  });
}

//aqui se cargan los detalles de el plato

function ProcesarDetalles(datos){
    var IdPlato = document.getElementById("platoId");
    var imagenPlato = document.getElementById("imgPlato");
    var nombrePlato = document.getElementById("txtNombrePlato");
    var precioPlato = document.getElementById("txtPrecioPlato");
    var descripcion = document.getElementById("txtDescripcionPlato");

    IdPlato.value = datos.IdPlato
    imagenPlato.src = datos.URLFotografia;
    nombrePlato.innerText = datos.Nombre;
    precioPlato.innerText = datos.Precio;
    descripcion.innerText = datos.Descripcion;
}

function AgregarPedido(){
  var idPlato = document.getElementById("platoId").value;
  var cantidad = document.getElementById("cantidadPlatos").value;
  var array = new Array(idPlato, cantidad);

  sessionStorage.setItem(idPlato, JSON.stringify(array));
  
  alert("Se ha agregado correctamente el pedido");
}

function CargarListaDetalles(){
  $.mobile.changePage("#pedido");
  $('#listaDetalles').empty();
  var len = sessionStorage.length;
  for (var i = 0; i < len; i++) {
    
    key = sessionStorage.key(i);  
    val = sessionStorage.getItem(key);
    valor = $.parseJSON(val);
    alert(valor[0]);
    var req = $.ajax({
      url: 'http://ws-restaurante-udata.azurewebsites.net/WSPlatos.svc/InfoPlatoPorId?id=' + valor[0],
      dataType: 'jsonp',
      timeout: 10000,
      success: function(datos){MostrarDetalle(datos, valor[1])}
    });
  }
  $('#listaDetalles').listview('refresh');
}


function MostrarDetalle(datos, cantidad){
  var idUsuario = JSON.parse(localStorage["cliente"]).IdUsuario;
  var usuario = document.getElementById("usuarioId");
  usuario.value = idUsuario;

  var nuevoLi = document.createElement("li");
  var nuevoA = document.createElement("a");
  nuevoLi.setAttribute("id", datos.IdPlato);
  nuevoLi.setAttribute("onclick", "GuardarIdDetalle(this.id)");
  nuevoA.setAttribute("data-rel", "popup");
  nuevoA.setAttribute("data-position-to", "window");
  nuevoA.setAttribute("data-transition", "slidedown");
  nuevoA.innerText = datos.Nombre + " " + datos.Precio;
  nuevoA.href = "#popupEliminarPedido";
  nuevoLi.appendChild(nuevoA);
  $('#listaDetalles').append(nuevoLi);
}

function GuardarIdDetalle(id){
  var IdDetalle = document.getElementById("detalleId");
  IdDetalle.value = id;
}

function EliminarDetalle(){
  var detalle = document.getElementById("detalleId").value;
  sessionStorage.removeItem(detalle);
  CargarListaDetalles();
}

function EnviarPedido(){
  ObtenerDireccion();

  var usuario = document.getElementById("usuarioId").value;
  var direccion = document.getElementById("address").value;
  var req = $.ajax({
    url: 'http://ws-restaurante-udata.azurewebsites.net/WSPedido.svc/AgregarPedido?idUsuario='+ usuario + '&direccion=' +direccion,
    dataType: 'jsonp',
    timeout: 10000,
    success: function(datos){EnviarDetalles(datos)},
    error: function(){alert("Error")}
  });
}

function EnviarDetalles(datos){
  alert();
  var len = sessionStorage.length;

  for (var i = 0; i < len; i++) {
    
    key = sessionStorage.key(i);  
    val = sessionStorage.getItem(key);
    valor = $.parseJSON(val);
    var req = $.ajax({
      url: 'http://ws-restaurante-udata.azurewebsites.net/WSDetalles.svc/AgregarDetalle?pedido=' + datos.IdPedido + "&plato=" + valor[0] + "&cantidad="+ valor[1],
      dataType: 'jsonp',
      timeout: 10000,
      success: function(){alert("Su orden se ha enviado con éxito")}
    });
  }
}


function ObtenerDireccion(){
      x = navigator.geolocation;
      x.getCurrentPosition(success, failure);
}
    
    function success(position) {
      var mylat = position.coords.latitude;
      var mylong = position.coords.longitude;
      
      geocoder = new google.maps.Geocoder();

      var coords = new google.maps.LatLng(mylat, mylong);
      codeLatLng(mylat + ", " + mylong);
    }

    function failure() {
      $('#lat').html("<p>It didn't work, co-ordinates not available!</p>");
    }
     
    function closeInfoWindow() {
            infowindow.close();
       }
     
     function failure() {
      $('#lat').html("<p>It didn't work, co-ordinates not available!</p>");
    }
     
    function codeLatLng(coordenadas) {
      var input = coordenadas;
      var latlngStr = input.split(',', 2);
      var lat = parseFloat(latlngStr[0]);
      var lng = parseFloat(latlngStr[1]);
      var latlng = new google.maps.LatLng(lat, lng);
      geocoder.geocode({'latLng': latlng}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          if (results[0]) {
            $('#address').val(results[0].address_components[0].long_name + ", " + results[0].address_components[1].long_name + ", " + results[0].address_components[2].long_name + ", " + results[0].address_components[3].long_name);
          } else {
            alert('No results found');
          }
        } else {
          alert('Geocoder failed due to: ' + status);
        }
      });
    }


function CargarUsuario() {
    var id = JSON.parse(localStorage["cliente"]).IdUsuario;
    var req = $.ajax({
       url: 'http://ws-restaurante-udata.azurewebsites.net/WSUsuario.svc/ObtenerUsuario?id='+ id,
       dataType: "jsonp",
       timeout: 1000,
       success: function(datos){MostrarDatosAModificar(datos)}
    });
}

function MostrarDatosAModificar(datos){
  document.getElementById("correo").value =  "" +datos.Correo;
  document.getElementById("nombre").value =  "" +datos.Nombre;
  document.getElementById("apellidos").value =  "" +datos.Apellidos;
  document.getElementById("direccion").value =  "" +datos.DireccionFisica;
  document.getElementById("contraseña").value =  "" +datos.Contrasena;
}

function ModificarUsuario(){
    var id = JSON.parse(localStorage["cliente"]).IdUsuario;
    var correo = $("#correo").val();
    var nombre = $("#nombre").val();
    var apellidos = $("#apellidos").val();
    var direccion = $("#direccion").val();
    var contraseña = $("#contraseña").val();

    if(correo !== "" && nombre !== "" && apellidos !== "" && direccion !== "" && contraseña !== ""){
        var req = $.ajax({
           url: 'http://ws-restaurante-udata.azurewebsites.net/WSUsuario.svc/ModificarUsuario?id=' + id + '&correo=' + correo + '&nombre=' + nombre + '&apellidos=' + apellidos + '&direccion=' + direccion + '&contraseña=' + contraseña,
           dataType: 'jsonp',
           timeout: 10000,
           success: function(){
               alert("Se modificaron los datos de manera correcta");
               location.href = "#menuPrincipal";
           }
        });
    }else{
        $('#mensajeErrorModificar').html("Debe completar los datos solicitados");
    }
}