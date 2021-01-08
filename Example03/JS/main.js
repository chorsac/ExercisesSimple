var usuarios;
var selected;
var nuevo = true;

index();

$('.save').on('click', function () {
	if (nuevo == false) {
		update($(selected).attr('cont-info'));
	} else {
		create();
	}
});

$('.new').on('click', function () {
	nuevo = true;
	cleanForm();
})

function clean(element) {
	$(element).removeClass('active');
	$(element).find('.oi-trash').css("color", "#b14a4a");
}

function cleanForm() {
	$('.cont-form')[0].reset();
}

//Actualiza la interfaz con nueva información
function show() {
	$('.contacts-list').empty();

	cleanForm();

	if (usuarios) {
		Object.keys(usuarios).forEach(function (element) {
			$('.contacts-list').append(
				'<li class="list-group-item d-flex justify-content-between align-items-center contact" cont-info="' + element + '">' + 
				usuarios[element].name + ' ' + usuarios[element].last_name + ' <span class="oi oi-trash contact-delete"></span></li>'
			);
		});
	}

	$('.contact').on('click', function () {

	if ($(this).hasClass('active')) {
		nuevo = true;

		$(this).removeClass('active');
		cleanForm();

		$(this).find('.oi-trash').css("color", "#b14a4a");
	} else {
		nuevo = false;

		// Clean the last item
		clean(selected);
		selected = $(this);

		// Style the new item
		$(this).addClass('active');
		$(this).find('.oi-trash').css("color", "white");

		display($(this).attr('cont-info'));
	}

	});

	$('.contact-delete').on('click', function() {
		destroy($($(this).parent()).attr('cont-info'));
	});
}

// Muestra el usuario al hacer click en el
function display(indice) {
	$('.name').val(usuarios[indice].name);
    $('.last-name').val(usuarios[indice].last_name);
    $('.email').val(usuarios[indice].email);
    $('.phone').val(usuarios[indice].phone);
}



// ---------------------- Firebase functions



// Obtener todos los usuarios
function index() {
	firebase.database().ref('/users/').once('value').then(function (snapshot) {
		usuarios = snapshot.val();
        show(snapshot.val());
    });
}

// Crear usuario
function create() {
	if ($('.name').val() && $('.last-name').val() && $('.email').val() && $('.phone').val()) {

		firebase.database().ref('users/' + Math.round((Math.random() * 100))).set({
        name: $('.name').val(),
        last_name: $('.last-name').val(),
        email: $('.email').val(),
        phone: $('.phone').val()

    }).then(function () {
        index();
    });
	} else {
		alert('Porfavor rellena todos los campos.');
	}
	
}

// Actualizar usuario
function update(indice) {

	if ($('.name').val() && $('.last-name').val() && $('.email').val() && $('.phone').val()) {

		firebase.database().ref('users/' + indice).update({
	        name: $('.name').val(),
	        last_name: $('.last-name').val(),
	        email: $('.email').val(),
	        phone: $('.phone').val()
	    });
	    index();
	} else {
		alert('Porfavor rellena todos los campos.');
	}
}

// Eliminar usuario
function destroy(indice) {
	var ref = firebase.database().ref('/users/' + indice);
    ref.remove();

    index();
}
