
//Validacion de formulario de registro

window.addEventListener("load", function() {
    let formulario = document.querySelector("form.registro");
        console.log(formulario.username)
    formulario.addEventListener("submit", function(e) {
        
        let errores = [];

        let campoFullname = document.querySelector("input.fullname");
        
        // const spl3 = nombre.value.split(' ') //Separamos el valor por espacios
        // .filter(function(n) { return n != '' }) //Ignoramos los resultados que no contengan nada
        // .length;//Cogemos la logintud del array resultante del split

        if(campoFullname.value == "") {
            errores.push("El campo de nombre debe estar completo");
        // } else if (spl3 > 2){
        //     error = true;
        //     alert("El campo de no mbre debe tener al menos nombre y apellido")
        }

        let campoUsername = document.getElementById("#username");
        
        if(campoUsername.value == "") {
            console.log(campoUsername)
            errores.push("El campo de usuario debe estar completo");
        }

        let campoPassword = document.querySelector("input.password");

        if(campoPassword.value == "") {
            errores.push("El campo de contraseña debe estar completo");
        }

        if (errores > 0) {
            e.preventDefault();

            let ulErrores = document.querySelector("div.signupErrors ul");
            for (let i = 0; i < errores.length; i++) {
                
                ulErrores.innerHTML += "<li>" + errores[i] + "</li>"
            }
        }

    });
})