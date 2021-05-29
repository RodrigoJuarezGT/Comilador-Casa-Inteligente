const editor = CodeMirror(document.querySelector("#codein"), {
    lineNumbers: true,
    tabSize: 2,
    value: "",
    theme: "dracula",
    mode: "text/x-csrc",
    });

var boton_aumentar_hora = document.getElementById("aumentar_hora");
var boton_disminuir_hora = document.getElementById("disminuir_hora");
var icono_sol_luna = document.getElementById("icono_sol_luna");
var boton_compilar = document.getElementById("boton_compilar");
var boton_limpiar = document.getElementById("boton_clear")
var boton_terminal = document.getElementById("boton_terminal")
var consola = document.getElementById("consola");
var cons = true
var hora = document.getElementById("hora")
var color_ensendido = "#d9d9d9"
var color_apagado = "#242424"




var foco = {
    "identificador": "lampara",
    "tipo" : "foco", 
    "habitacion": "h7", 
    "sensor": "hora",
    "valor":"12",
    "accion": "off",
    "condicion": function(){
        if(document.getElementById(this.sensor).innerHTML == this.valor){
            if(this.accion == "on"){
                this.on();
            }else if(this.accion == "off"){
                this.off();
            }
        }
    }, 
    "on": function(){
        document.getElementById(this.habitacion).style.fill = color_ensendido;
    },
    "off": function(){
        document.getElementById(this.habitacion).style.fill = color_apagado;
    }
};

foco.on();
foco.condicion();






var buscar_cierre_declaracion
var buscar_funcion

var indice_inicial
var indice_variables = 0
var codigo_evaluar
var cadena_evaluar
var key_words = ["Objeto"]
var array_funciones = ["Sensor","On","Off"]
var array_variables_declaradas = []
var variable_declarada
var habitacion
var array_objetos = []


boton_compilar.onclick = function(){
    array_variables_declaradas = []
    array_objetos = []
    var codigo_entrada = editor.getValue();
    indice_inicial = 0

    for(var i=1; i<= codigo_entrada.length; i++){

        var codigo_evaluar = codigo_entrada.slice(i-1,i)

        if(codigo_evaluar == '('){

            cadena_evaluar = codigo_entrada.slice(indice_inicial,i-1)

            if(key_words.some(function(value){return value == cadena_evaluar})){

                for(var x = i; x<=codigo_entrada.length; x++)
                {
                    buscar_cierre_declaracion = codigo_entrada.slice(x-1,x)

                        if(buscar_cierre_declaracion == ","){
                            variable_declarada = codigo_entrada.slice(i,x-1)  
                            var indice_coma = x;
                        }
                        if(buscar_cierre_declaracion == ')'){
                            habitacion = codigo_entrada.slice(indice_coma,x-1)
                            break
                        }

                }
                array_variables_declaradas.push(variable_declarada)
                indice_variables++

                array_objetos.push({
                    "identificador": variable_declarada,
                    "habitacion": habitacion, 
                    "sensor": "",
                    "valor": "",
                    "accion": "",
                    "condicion": function(){ 
                        if(document.getElementById(this.sensor).innerHTML == this.valor){
                            if(this.accion == "On"){
                                this.on();
                            }else if(this.accion == "Off"){
                                this.off();
                            }
                        }
                    }, 
                    "on": function(){
                        document.getElementById(this.habitacion).style.fill = color_ensendido;
                    },
                    "off": function(){
                        document.getElementById(this.habitacion).style.fill = color_apagado;
                    }
                })

            }else{
                if(cadena_evaluar == "Sensor" || cadena_evaluar == "Off" || cadena_evaluar == "On"){
                    
                }else{
                    consola.innerHTML += "<div style='color: red;'>Expresion no reconocida: "+ cadena_evaluar +"<div>"
                }
            }

            indice_inicial = i;
            continue

        }else
        if(codigo_evaluar == '.'){
            cadena_evaluar = codigo_entrada.slice(indice_inicial,i-1)

            if(array_variables_declaradas.some(function(value){return value == cadena_evaluar})){
                

                for(var x = i; x<=codigo_entrada.length; x++)
                {
                    buscar_cierre_declaracion = codigo_entrada.slice(x-1,x)

                        if(buscar_cierre_declaracion == "("){
                            buscar_funcion = codigo_entrada.slice(i,x-1)
                            break
                        }

                }

                if(array_funciones.some(function(value){return value == buscar_funcion})){

                    if(buscar_funcion == "Sensor"){
                        
                        for(var x = i; x<=codigo_entrada.length; x++)
                        {
                            buscar_cierre_declaracion = codigo_entrada.slice(x-1,x)
        
                                if(buscar_cierre_declaracion == ":"){
                                    
                                    array_objetos[array_variables_declaradas.indexOf(variable_declarada)].sensor = codigo_entrada.slice(i+7,x-1)
                                    var indice_coma = x;
                                }
                                if(buscar_cierre_declaracion == ","){
                                    array_objetos[array_variables_declaradas.indexOf(variable_declarada)].valor = codigo_entrada.slice(indice_coma,x-1)
                                    var indice_coma = x;
                                }
                                if(buscar_cierre_declaracion == ")"){
                                    array_objetos[array_variables_declaradas.indexOf(variable_declarada)].accion =  codigo_entrada.slice(indice_coma,x-1) 
                                    break
                                }
        

                        }

                    }else
                    if(buscar_funcion == "On"){
                        array_objetos[array_variables_declaradas.indexOf(variable_declarada)].on()
                    }else
                    if(buscar_funcion == "Off"){
                        array_objetos[array_variables_declaradas.indexOf(variable_declarada)].off()
                    }

                }else{
                    consola.innerHTML += "<div style='color: red;>funcion no reconocida: "+ buscar_funcion +"<div>"
                }

            }else{
                consola.innerHTML += "<div style='color: red;'>Objeto no delcarado: "+ cadena_evaluar +"<div>"
            }

            indice_inicial = i;
            continue

        }

        

        
        if(codigo_evaluar == "\n"){
            indice_inicial = i
            continue
        }
        

    }

    consola.innerHTML += "<div style='color: #21e513'>casa inteligente: compilacion terminada . . .<div>"
}




boton_limpiar.onclick = function(){
    consola.innerHTML = ""
    editor.setValue("")
}

boton_terminal.onclick = function(){
    if(cons){
        consola.classList.remove("anima_consola_mostrar")
        consola.classList.add("anima_consola_esconser")
        cons = false
    }else{
        consola.classList.remove("anima_consola_esconser")
        consola.classList.add("anima_consola_mostrar")
        cons = true
    }
}




boton_aumentar_hora.onclick = function(){
    if(hora.innerHTML == 24){
        hora.innerHTML = 0;
    }
    hora.innerHTML = Number(hora.innerHTML)+1; 

    if(hora.innerHTML >= 18 || hora.innerHTML <= 5){
        icono_sol_luna.classList.remove("fa-sun");
        icono_sol_luna.classList.add("fa-moon");
    }
    if(hora.innerHTML <= 17 && hora.innerHTML >= 6){
        icono_sol_luna.classList.remove("fa-moon");
        icono_sol_luna.classList.add("fa-sun");
    }
    ejecutar_reloj()
}
boton_disminuir_hora.onclick = function(){
    if(hora.innerHTML == 1){
        hora.innerHTML = 25;
    }
    hora.innerHTML = Number(hora.innerHTML)-1; 

    if(hora.innerHTML >= 18 || hora.innerHTML <= 5){
        icono_sol_luna.classList.remove("fa-sun");
        icono_sol_luna.classList.add("fa-moon");
    }
    if(hora.innerHTML <= 17 && hora.innerHTML >= 6){
        icono_sol_luna.classList.remove("fa-moon");
        icono_sol_luna.classList.add("fa-sun");
    }
    ejecutar_reloj()
}


function ejecutar_reloj(){
    for(var i = 0; i <= array_objetos.length; i++){
        array_objetos[i].condicion()
    }
    
}



//script popu

var popup = document.getElementById("popup")
var boton_popup = document.getElementById("boton_info")
var popupstate = true

boton_popup.onclick = function(){

    if(popupstate){
        popup.style.display = "none"
        popupstate = false
    }else{
        popup.style.display = "block"
        popupstate = true
    }

    
}

