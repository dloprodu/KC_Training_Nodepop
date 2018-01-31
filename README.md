# Nodepop Restful API
#### David López Rguez

## Información general

**Nodepop** es un API para la gestión de anuncios. La api permite las siguientes acciones:
- Registro de usuarios.
- Autenticación.
- Listar etiquetas disponibles para los anuncios.
- Listar anuncios.

Para iniciar el API: `npm run start`
<br>
Para iniciar el cluster: `npm run cluster`

## Demo desplegada en AWS (DevOps)

[Index - breve descripción de la API](http://ec2-18-218-129-147.us-east-2.compute.amazonaws.com)

__DNS__: http://ec2-18-218-129-147.us-east-2.compute.amazonaws.com

__IP__: http://18.218.129.147

## Configuración de la API

Para configurar correctamente el API crear un fichero *.env* con los siguientes parámetros de configuración:
- **MONGODB_CONNECTIONSTRING**: URL de conexión a una instancia de MongoDB.
- **SALT_WORK_FACTOR**: Numero entero que será el factor para generar el hash del password (10 por ejemplo).
- **JWT_SECRET**: Cadena alfanumérica que servirá como clave secreta para generar los tokens de autenticación.
- **JWT_EXPIRESIN**: Tiempo de espiración del JWT.
```
MONGODB_CONNECTIONSTRING=mongodb://localhost/nodepop
SALT_WORK_FACTOR=10
JWT_SECRET=AGDW2123lSAL204AL02LAUS2LS
JWT_EXPIRESIN=2d
```
## Inicialización de base de datos de pruebas

Para generar una base de datos de prueba ejecutar el comando siguiente:
```
npm run installDB
```
El script generará 10 usuarios y 50 anuncios que vinculará aleatoriamente a los usuarios.

## Respuestas de la API

Las respuestas de la API están estandarizadas y devuelven una estructura común con los siguientes campos.
```json
{
	"version": "1.0.0",
	"status": "success",
	"message": "OK",
	"datetime": "2017-12-16T18:20:34.871Z"
}
```
En el caso de que la llamada devuelva algún dato se añade el campo **data**.

```json
{
	"version": "1.0.0",
	"status": "success",
	"message": "OK",
	"datetime": "2017-12-16T18:21:06.702Z",
	"data": [
		"work",
		"lifestyle",
		"motor",
		"mobile"
	]
}
```
En el caso de que la llamada devuelva un resultado paginado se añade el campo **data** y **total**. Este último representa el número total de elementos.
```json
{
	"version": "1.0.0",
	"status": "success",
	"message": "OK",
	"datetime": "2017-12-16T18:21:06.702Z",
	"data": [
		{
			"_id": "5a3444d83241a4ceea3457f8",
			"user": "5a3444d73241a4ceea3457f3",
			"name": "Clothes",
			"description": "Ri miz zuzuja tufupa sis.",
			"price": 6227.88,
			"photo": "images/ads/500x300/05.jpg",
			"createdAt": "2017-12-15T21:55:36.049Z",
			"tags": [
				"lifestyle",
				"mobile"
			],
			"forSale": true,
			"type": "ad"
		}
	],
	"total": 19
}
```
En caso de error se añade el campo **error**.

```json
{
	"version": "1.0.0",
	"status": "error",
	"message": "Query params error",
	"datetime": "2017-12-16T19:13:25.886Z",
	"error": {
		"page": "'page' debe ser un múmero"
	}
}
```

## Modelo
```mermaid
graph LR
Ad[Ad] -- A user can have zero, one or more ads --> User[User]
```
### User
```json
{
	"type": "user",
	"name": "",
	"gender": ["male","female"],
	"thumbnail": "",
	"email": "",
	"password": "",
	"createdAt": ""
}
```
### Ad
```json
{
	"type": "ad",
	"user": "",
	"name": "",
	"description": "",
	"forSale": [true,false],
	"price": 0,
	"photo": "",
	"tags": [],
	"createdAt": ""
}
```
## Registro de usuarios

|URI             |METHOD                         |BODY                 |
|----------------|-------------------------------|---------------------|
|`/api/v1/:lang/users/signup`|`POST`|`{ name, gender, email, password }`|

### Example
`http://localhost:3000/api/v1/es/users/signup`
##### Body
```json
{
	"name": "Carlos",
	"gender": "male",
	"email": "carlos@test.com",
	"password": "1234"
}
```
##### Response
```json
{
    "version": "1.0.0",
    "status": "success",
    "message": "OK",
    "datetime": "2017-12-16T18:21:41.752Z"
}
```
##### Error
```json
{
    "version": "1.0.0",
    "status": "error",
    "message": "Query params error",
    "datetime": "2017-12-16T20:45:12.593Z",
    "error": {
        "email": "El email no es válido"
    }
}
```
## Autenticación

|URI             |METHOD                         |BODY                 |
|----------------|-------------------------------|---------------------|
|`/api/v1/:lang/users/login`|`POST`|`{ email, password }`|

### Example
`http://localhost:3000/api/v1/es/users/login`
##### Body
```json
{
	"email": "adam@test.com",
	"password": "1234"
}
```
##### Response
```json
{
    "version": "1.0.0",
    "status": "success",
    "message": "OK",
    "datetime": "2017-12-16T20:22:06.386Z",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNWEzNTdlMzQzZmIxN2JmM2Q4NDBmYjlkIiwiaWF0IjoxNTEzNDU1NzI2LCJleHAiOjE1MTM2Mjg1MjZ9.G40iThNnq63TkZkOwG8M14yjTUow7U4ys52hRuS2VE4"
    }
}
```
##### Error
```json
{
    "version": "1.0.0",
    "status": "error",
    "message": "Authentication error",
    "datetime": "2017-12-16T20:36:03.554Z",
    "error": "Usuario o contraseña incorrecta"
}
```

## Listado de etiquetas

|URI             |METHOD                         |QUERY STRING |HEADER  |
|----------------|-------------------------------|-------------|--------|
|`/api/v1/:lang/ads/tags`|`GET`|`token`|`x-access-token`|
### Example
`http://localhost:3000/api/v1/es/ads/tags?token=`
##### Response
```json
{
	"version": "1.0.0",
	"status": "success",
	"message": "OK",
	"datetime": "2017-12-16T18:21:06.702Z",
	"data": [
		"work",
		"lifestyle",
		"motor",
		"mobile"
	]
}
```
## Listado de anuncios

|URI             |METHOD                         |QUERY STRING |HEADER  |
|----------------|-------------------------------|-------------|--------|
|`/api/v1/:lang/ads`|`GET`|`name,tags,for_sale,price,page,per_page,sort,fields,token`|`x-access-token`|
### Query params
- **name**: Permite filtrar por nombre. Puede ser el nombre completo o parte inicial del nombre. Insensitivo a mayusculas y minúsculas.
- **tags**: Permite filtrar por tags. **Si se indican varios tags separados por coma se devolveran los anuncios que contengan alguno de esos tags**. Ejemplo: `tag=mobile,lifestyle`
- **for_sale**: Permite filtrar por tipo de anuncio (true o false).
- **price**: Permite filtrar por precio.
  - 50: coincide exactamente con el precio indicado.
  - -50: menores o iguales al precio indicado.
  - 50-: mayores o iguales al precio indicado.
  - 10-50: dentro del rango especificado.
- **page**: Página.
- **per_page**: Número de elementos por página.
- **sort**: Permite ordenar por algún campo.
- **fields**: Permite seleccionar los campos que queremos obtener. Ejemplo: `fields=name description`
### Example
`http://localhost:3000/api/v1/es/ads?page=0&per_page=1&price=5000-&tag=mobile&token=`
##### Response
```json
{
	"version": "1.0.0",
	"status": "success",
	"message": "OK",
	"datetime": "2017-12-16T20:51:35.315Z",
	"data": [
		{
			"_id": "5a35658259c395e6c2030d3f",
			"user": "5a35658259c395e6c2030d3e",
			"name": "Mountain Bike",
			"description": "Ku jo pepbe tukiru ruk.",
			"price": 6627.47,
			"photo": "images/ads/500x300/01.jpg",
			"__v": 0,
			"createdAt": "2017-12-16T18:27:14.594Z",
			"tags": [
				"lifestyle",
				"mobile",
				"motor"
			],
			"forSale": false,
			"type": "ad"
		}
	],
	"total": 20
}
```