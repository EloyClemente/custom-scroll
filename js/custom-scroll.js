

var CustomScroll = function(target_id, estilo) // Recibe el id del elemento a scrolear y el estilo para el scroll
{
	this.target = document.getElementById(target_id)
	this.id_scroll  = target_id + '_scroll'
	this.id_guia    = target_id + '_guia'
	this.id_mando   = target_id + '_mando'
	this.id_mascara = target_id + '_mascara'
	this.estilo = estilo
	this.array = []
	this.pulsado = false
	



	this.crear = function()
	{
		// CREAR CONTAINER
		//========================================
	 	var scroll = document.createElement('div')
	 	scroll.classList.add(this.estilo)
	 	scroll.id = this.id_scroll

	 	this.target.parentNode.appendChild(scroll) // Insertar scroll en la capa padre
	 	scroll.appendChild(this.target) // Insertar elemento en la capa scroll


	 	// CREAR GUIA
	 	//======================================
	 	var guia = document.createElement('div')
	 	guia.classList.add('guia')
		guia.id = this.id_guia


		// CREAR MANDO
		//=======================================
		var mando = document.createElement('div')
		mando.classList.add('mando')
		mando.id = this.id_mando


		// CREAR MASCARA
		//=======================================
		var mascara = document.createElement('div')
		mascara.classList.add('mascara')
		mascara.id = this.id_mascara

		
		guia.appendChild(mando)
		guia.appendChild(mascara)
	 	scroll.appendChild(guia)
	 	


	 	this.ejecutar()
	}




	this.ejecutar = function() // EJECUTA AL CARGAR Y REDIMENSIONAR
	{
		var that = this

		if(this.target)
		{
			this.altura_mando()
			this.color_mascara()
			this.mover_mando()
			this.mover_mando_desde_la_guia()
			this.wheel()

			window.addEventListener('resize', function(){
				that.altura_mando()
				that.reubicar_texto()})
		}
	}




	// ELEMENTOS PRINCIPALES
	//==========================================================================
	this.container = function(){ return document.getElementById(this.id_scroll)}
	this.guia      = function(){ return document.getElementById(this.id_guia)}
	this.mando     = function(){ return document.getElementById(this.id_mando)}
	this.mascara   = function(){ return document.getElementById(this.id_mascara)}
	//==========================================================================




	this.altura_mando = function() // CONTROLA EL TAMAÑO DEL MANDO
	{
		var that = this
		var guia = this.guia()
		var mando = this.mando()
		var altura_texto = this.container().children[0].offsetHeight
		var porcentaje_texto = (this.container().offsetHeight * 100) / altura_texto
		var mascara = this.mascara()


		// Tamaño del mando en función del tamaño del container
		//=====================================================
		mando.style.height = porcentaje_texto + '%'
		mascara.style.height = mando.offsetHeight + 'px'
		//=====================================================

		// Si llega al tope inferior
		if(mando.getBoundingClientRect().bottom >= guia.getBoundingClientRect().bottom)
		{
			// Modifica el top en función de la altura del mando
			mando.style.top = guia.offsetHeight - mando.offsetHeight + 'px'
		}
		




		// MUESTRA Y OCULTA EL SCROLL
		//==============================================
		if(altura_texto < this.container().offsetHeight)
		{
			guia.style.opacity = '0' // Fade

			setTimeout(function()
			{
				guia.style.display = 'none'
				that.target.style.top = '0px' // Ubica el texto al top
			}, 500)
		}
		else
		{
			guia.style.display = 'block'
			
			setTimeout(function()
			{
				guia.style.opacity = '1'
			}, 500)
		}
		//==============================================
	}





	this.color_mascara = function() // El color onhover ha de aplicarse desde aquí debido al z-index
	{
		var that = this
		var mando = this.mando()

		mando.addEventListener('mouseenter', function()
		{
			that.mascara().style.backgroundColor = '#bbb'
		})

		mando.addEventListener('mouseleave', function()
		{
			that.mascara().style.backgroundColor = '#dadada' // Si le paso el color desde arriba como propiedad, no la reconoce
		})
	}






	this.reubicar_texto = function()
	{
		// CORRIGE LA POSICIÓN TOP DEL TEXTO AL REDIMENSIONAR Y AL CLICAR EN LA GUÍA
		//==========================================================================
		var porcentaje = (this.mando().offsetTop * 100) / this.mando().offsetHeight
		this.target.style.top = - porcentaje + '%'
		//==========================================================================
	}






	this.mover_mando = function(event)
	{
		var that = this
		var posicion_mouse
		var pulsado = false
		var mascara = this.mascara()
		
		


		window.addEventListener('mousemove', function(event)
		{ 
			if(that.guia())  // Si existe el scroll
			{
				var tope = 'techo'
				var guia = that.guia()
				var mando = that.mando()
				var top_guia = guia.getBoundingClientRect().top
				var top_mando = mando.getBoundingClientRect().top
				var bottom_guia = guia.getBoundingClientRect().bottom
				var bottom_mando = mando.getBoundingClientRect().bottom
				var these = that

				

				

				// DETECTA SI EL RATÓN ESTÁ PULSADO O NO
				//=======================================================================
				mando.addEventListener('mousedown', function()
				{
					pulsado = true
					posicion_mouse = event.clientY - mando.getBoundingClientRect().top
					these.target.style.userSelect = 'none'
					mascara.style.transition = 'none'
					mascara.style.transitionProperty = 'background-color'
					mascara.style.transitionDuration = '.3s'
				})

				window.addEventListener('mouseup', function()
				{
					pulsado = false
					these.target.style.userSelect = 'auto'
					array = []
				})
				//=======================================================================

		
			


				if(pulsado == true)
				{

					// MARCA LA DIRECCIÓN
					//=========================================================================
					that.array.push(event.clientY) // Para detectar el cambio de dirección

					if(that.array[that.array.length - 1] > that.array[that.array.length - 2]){
						direccion = 'bajar'}

					else{
						direccion = 'subir'}
					//=========================================================================



					// DETECTA SI HACE TOPE O NO
					//==============================
					 if(top_mando <= top_guia){
					 	tope = 'techo'}

					 if(top_mando > top_guia){
					 	tope = 'no'}

					 if(bottom_mando >= bottom_guia){
					 	tope = 'suelo'}
					 //==============================




					 // EVITA QUE EL MANDO SE SALGA DE LA GUIA
					 //=========================================
					 if(tope == 'techo' && direccion == 'subir')
					 {
					 	mando.style.top = '0px'
					 	posicion_mouse = event.clientY - mando.getBoundingClientRect().top // Nueva posición del mouse
					 }
					 else
					 {
					 	mando.style.top = (event.clientY - top_guia) - posicion_mouse + 'px'
					 }


					 if(tope == 'suelo' && direccion == 'bajar')
					 {
					 	mando.style.top = (guia.offsetHeight - mando.offsetHeight) + 'px'
					 	posicion_mouse = event.clientY - mando.getBoundingClientRect().top // Nueva posición del mouse
					 }
					 else
					 {
					 	mando.style.top = (event.clientY - top_guia) - posicion_mouse + 'px'
					 }



					// MUEVE EL TEXTO SEGÚN LA POSICIÓN DEL MANDO EN LA GUÍA
					//===========================================================
					var porcentaje = (mando.offsetTop * 100) / mando.offsetHeight
					that.target.style.top = - porcentaje + '%'
					//===========================================================




				}

				// LA MÁSCARA SIGUE LA POSICIÓN DEL MANDO
				//==============================================
				mascara.style.height = mando.offsetHeight + 'px'
				mascara.style.top = mando.offsetTop + 'px'
			}
		})
	}






	this.mover_mando_desde_la_guia = function(event) // MUEVE EL SCROLL AL CLICAR EN LA GUÍA
	{
		var container = this.container()
		var guia = this.guia()
		var mando = this.mando()
		var mascara = this.mascara()
		var that = this



		

		guia.addEventListener('mousedown', function(event)
		{		
			if(event.clientY > mando.getBoundingClientRect().bottom)
			{
				mando.style.top = (event.clientY - mando.offsetHeight) - container.getBoundingClientRect().top + 'px'

				mascara.style.transition = 'all, .3s'
				mascara.style.top = mando.offsetTop + 'px'
				that.reubicar_texto()
			}
			else if(event.clientY < mando.getBoundingClientRect().top)
			{
				mando.style.top = event.clientY - container.getBoundingClientRect().top + 'px'

				mascara.style.transition = 'all, .3s'
				mascara.style.top = mando.offsetTop + 'px'
				that.reubicar_texto()
			}
		})
	}






	this.wheel = function()
	{
		var that  = this
		var guia  = this.guia()
		var mando = this.mando()
		var mascara = this.mascara()




		$(this.container()).on('wheel', function(event){ // EVENTO WHEEL

			var these = that
			var guia = that.guia()
			var mando = that.mando()
			var top_guia = guia.getBoundingClientRect().top
			var top_mando = mando.getBoundingClientRect().top
			var bottom_guia = guia.getBoundingClientRect().bottom
			var bottom_mando = mando.getBoundingClientRect().bottom

			var recorrido = guia.offsetHeight - mando.offsetHeight
			var falta = recorrido - mando.offsetTop
			var cifra = recorrido - falta

			
			


			//========================================================
			mascara.style.transitionProperty = 'background-color, top'
			mascara.style.transitionDuration = '.3s, .1s'
			//========================================================


			

			if(event.originalEvent.deltaY > 0) // BAJAR
			{
				if(bottom_mando < bottom_guia - 1)
				{
					mando.style.top = (mando.offsetTop + 10) + 'px'
				}
			}
			else if(event.originalEvent.deltaY < 0) // SUBIR
			{
				if(top_mando > top_guia + 1)
				{
					mando.style.top = (mando.offsetTop - 10) + 'px'
				}
			}


			
		
				
				


			setTimeout(function() // Evita tomar medidas erróneas debido a la transición
			{
				// MUEVE EL TEXTO SEGÚN LA POSICIÓN DEL MANDO EN LA GUÍA
				//===========================================================
				var porcentaje = (mando.offsetTop * 100) / mando.offsetHeight
				that.target.style.top = - porcentaje + '%'
				//===========================================================

				if(porcentaje <= 0) // Evita el desfase de medida que provoca la transición
				{
					that.target.style.top = '0px'
				}

			}, 100)




			// LA MÁSCARA SIGUE LA POSICIÓN DEL MANDO
			//========================================
			mascara.style.top = mando.offsetTop + 'px'

		}); 
	}
}



// Recibe el id del elemento a scrolear y el estilo para el scroll
var scroll = new CustomScroll('texto', 'custom-scroll')
scroll.crear()











document.getElementsByTagName("html")[0].style.overflow = "hidden"
