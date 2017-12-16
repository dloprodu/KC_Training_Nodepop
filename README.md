# Nodepop Restful API
#### David López Rguez

## Información general

**Nodepop** es un API para la gestión de anuncios. La api permite las siguientes acciones:
- Registro de usuarios.
- Autenticación.
- Listar etiquetas disponibles para los anuncios.
- Listar anuncios.

## Configuración de la API

Para configurar correctamente el API cree un fichero *.env* con los siguientes parámetros de configuración:
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

## Registro de usuarios

## Autenticación

## Listado de etiquetas

## Listado de anuncios