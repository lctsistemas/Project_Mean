'use strict'

//const cliente = require('../models/cliente');
var Cliente = require('../models/cliente');

var bcrypt=require('bcrypt-nodejs')

var jwt=require('jwt-simple');

const registro_cliente= async function(req,res){
    //
    var data=req.body;

    var cliente_arr=[];

    var email_valid;

    var pass_valid;

    cliente_arr=await Cliente.find({email:data.email});

    if(cliente_arr.length==0){
        /**/
        if(data.email){
            let correo=data.email;

            const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        
            console.log(emailRegexp.test(correo));

            if(emailRegexp.test(data.email)){
                email_valid=true;
            }else{
                res.status(200).send({message:'Ingrese un correo valido',data:undefined});
            }
        }else{
            res.status(200).send({message:'Ingrese su correo',data:undefined});
        }

        if(data.password){
            pass_valid=true;
            bcrypt.hash(data.password, null, null, async function(err,hash){
                if(hash){
                   
                    data.password=hash;
                }else{
                    res.status(200).send({message:'ErrorServer',data:undefined});
                }

                if(email_valid==true && pass_valid==true){
                    var reg= await Cliente.create(data);
                    
                    res.status(200).send({data:reg});
                }else{
                    res.status(200).send({message:'Tardo demasiado',data:undefined});
                }

            })
        }else{
            res.status(200).send({message:'Ingrese su contraseña',data:undefined});
        }

        
    }else{
        res.status(200).send({message:'El email ya esta registrado en la base de datos',data:undefined});
    }

    
  
   
} 

const login_cliente= async function(req, res){
    var data=req.body;
    var cliente_arr=[]

    cliente_arr=await Cliente.find({email:data.email});

    if(cliente_arr.length==0){
        res.status(200).send({message:'No se encontro su email',data:undefined});    
    }else{
        let user =cliente_arr[0];

        bcrypt.compare(data.password,user.password,async function(error, check){
            if(check){
                res.status(200).send({
                    data:user,
                    token:jwt.createToken(user)});
            }else{
                res.status(200).send({message:'La contraseña no coincide',data:undefined});
            }
        })


    }

    
}

module.exports = {
    registro_cliente,
    login_cliente
}