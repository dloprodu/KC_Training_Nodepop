# Nodepop Restful API
#### David López Rguez

## Información general

**Nodepop** es un API para la gestión de anuncios. La api permite las siguientes acciones:
- Registro de usuarios.
- Autenticación.
- Listar etiquetas disponibles para los anuncios.
- Listar anuncios.

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

Las respuestas de la API están estandarizadas y devuelven una estructura común con lo siguientes campos.

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

En el caso de que la llamada devuelva un resultado paginado se añade el campo **data** y **total**.

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
		},
		{
			"_id": "5a3444d83241a4ceea3457fa",
			"user": "5a3444d83241a4ceea3457f9",
			"name": "Clothes and shoes",
			"description": "Etsen zo los edanosano nuehzid ivuwa go feci.",
			"price": 7771.27,
			"photo": "images/ads/500x300/06.jpg",
			"createdAt": "2017-12-15T21:55:36.147Z",
			"tags": [
				"motor",
				"work"
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

## Registro de usuarios

## Autenticación

## Listado de etiquetas

## Listado de anuncios