# TopDoctors Challenge

#### 1. Introducción

Propuesta de solución para el [Challenge de TopDoctors](https://bitbucket.org/topdoctors/backend-developer/src/master/challenge.md).
En este proyecto se expone una API para el control de los distintas estructuras de datos.

#### 2. Bases de datos

En nuestra legislación, aunque está legitimado el uso de datos de carácter personal con fines científicos, es un derecho de todo paciente que la información de carácter personal que deriva de la atención médica sea tratada de forma confidencial. La LOPDGDD establece que el tratamiento de los datos personales, incluidos los datos de carácter sanitario, están sometidos al deber de confidencialidad por parte tanto de los responsables y encargados del tratamiento, como de todas las personas que intervengan en cualquier fase de éste (artículo 5.1). Estamos ante un deber que se complementa, a su vez, con los deberes de secreto profesional a los que alude el apartado segundo del referido precepto legal, y que deberán interpretarse de conformidad con su normativa vigente.

Una de las opciones para poder trabajar con estos datos sin incumplir la normativa es el anonimato. Las colecciones de datos anónimos y los registros anonimizados pueden ser utilizados y cedidos sin el consentimiento informado de los sujetos. Este supuesto no precisaría de especiales consideraciones éticas, al no poder asociarse la información con persona alguna. Para cumplir con la normativa vigente hay que incluir:

> - Un sistema de anonimización de los datos
> - Herramientas que garanticen la confidencialidad y la seguridad de los datos.

En este proyecto se propone como solución al primer punto, trabajar con dos bases de datos diferentes:

> - mongo-db-accounts: contendrá la información personal de los pacientes
> - mongo-db-data: contendrá la información relacionada con síntomas o una enfermedad específica, en este caso, con el diagnóstico del paciente.

El segundo punto de confidencialidad ha sido trabajado solo por encima.
Se ha establecido un sistema de usuarios y roles con distintos permisos para poder leer, modificar o añadir información en el sistema. De este modo, se requerirá autenticación para poder realizar las peticiones. En concreto se ha utilizado [JSON_Web_Token](https://en.wikipedia.org/wiki/JSON_Web_Token). Cuando los usuarios se crean o logean en el sistema, reciben un token generado a partir de su id y su role, con un periodo de expiración.
Por otro lado, se utiliza la librería crypto para encriptar la información de ids que se facilita via API, es decir, el usuario nunca tendrá el id real del objeto solicitado, y la única forma de que se pueda utilizar para obtener información es que el sistema lo desencripte utilizando la misma SECRET_KEY_CRYPTO.

#### 3. Modelos de datos

Para poder utilizar la API hay que estar autorizado, es decir, el proyecto presenta distintos roles de usuarios y cada uno de ellos contendrá permisos diferentes para realizar las acciones que se exponen en la API.
Así, el primero modelo de datos será el de User:

```
    const UserSchema = Schema({
    email: {
        type: String,
        index: true,
        trim: true,
        lowercase: true,
        unique: true,
        required: "Email address is required",
        match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,63})+$/,
        "Please fill a valid email address",
        ],
    },
    password: {
        type: String,
        required: true,
        minlength: [8, "Password too short"],
    },
    role: {
        type: String,
        required: true,
        enum: ["Admin", "User", "Researcher"],
        default: "User",
    },
    group: { type: String, required: true, default: "None" },
    signupDate: { type: Date, default: Date.now },
    lastLogin: { type: Date, default: null },
});

```

En este punto cabe destacar el field "group". Se ha planteado un sistema en el que se puedan hacer agrupaciones de pacientes gestionadas por un mismo administrador.

```
const GroupSchema = Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
});
```

Solo los administradores pueden crear grupos.
Se ha implementado para la comodidad de las pruebas y el desarrollo que en el método de creación de un nuevo administrador, si el grupo no existiese que se crease también.

Los roles pueden ser:

> - Admin, que tendrá permisos para realizar cualquier accion.
> - User que podrá crear pacientes, asignarles un diagnostico o modificar esta información, pero no podrá acceder a la información a nivel de Grupo.
> - Researcher que únicamente podrá hacer peticiones de lectura. Sería un investigador que quisiese sacar datos o información del sistema pero sin modificar nada.

Un usuario puede crear Pacientes:

```
const PatientSchema = Schema({
  name: String,
  lastName: String,
  email: String,
  phone: String,
  identifierDoc: String,
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
});
```

Los pacientes quedan relacionados mediante el campo createdBy con el usuario que los creo (con su identificador).

Por ahora se permite tanto a Usuarios como Administradores crear Pacientes. Esto podría definirse de forma diferente segun nuestros intereses, por ejemplo se podría utilizar como estrategia que el admin sea simplemente un manager de usuarios y que sea cada usuario el que tenga un paciente asociado. O se podría también eliminar el nivel de User, ya que se asumiese que ningun usuario/paciente tuviese que acceder a esta API y entonces fuese el Admin quien crease los pacientes. Esto sería importante decidirlo antes de implementar lógicas de delete de información, o también surgen dudas respecto a si un usuario se crea después en la plataforma y tuviesemos que migrar la información del Admin (porque ya hubiese creado su perfil) a este usuario.

Hasta aquí, todos estos datos se almacenarán en la base de datos de mongo-db-accounts.

Un paciente puede tener N diagnosticos asociados, y como esta información ya es sensible se guardará en la base de datos mongo-db-data:

```
const DiagnosisSchema = Schema({
  date: { type: Date, default: Date.now },
  diagnosis: { type: String, require: true },
  prescription: { type: String, default: "" },
  createdBy: { type: Schema.Types.ObjectId, ref: "Patient" },
});
```

En este punto, se podrían haber implementado las prescripciones como un modelo diferente relacionado con el id del diagnostico, pero por tiempo no ha sido posible desarrollarlo.

#### 4. Instalación

Descargar el repositorio utilizando `git clone` o el botón de descargas.
Se ha utilizado [Docker Compose](https://docs.docker.com/compose/) por lo que para levantar el proyecto en local únicamente es necesario ejecutar: `docker compose -f "docker-compose.yml" up -d --build`.
Esto permitirá trabajar con las dos bases de datos y con la API en local, sin necesidad de realizar ninguna otra configuración.

#### 5. API

El proyecto expone una documentación online de la API, utilizando swagger, a la que se puede acceder (una vez levantado) desde la url: http://localhost:3000/doc/

#### 6. Ejemplo de Uso

Por tiempo, no se ha creado ningun seed inicial y por tanto se debe construir la base de datos antes de poder realizar las peticiones de consulta de los diagnósticos.
Para ello los pasos a seguir serían:

1. Crear un administrador y un grupo de pacientes con /users/new_admin
2. Esta peticion devuelve un token de tipo Administrador con el que podremos realizar el resto de peticiones. Para ello, hace falta autorizarse en Swagger añadiendo en el Authorization un string con: 'Bearer <token>'. Tambien nos devuelve el id del usuario para trabajar: userId.
3. En este punto podemos seguir creando usuarios con role "User" utilizando /users/signup.
4. Si queremos parar las pruebas y continuar en otro momento, siempre podemos utilizar /users/signin para obtener un token de acceso y el id del usuario.
5. Tenemos otras dos peticiones de usuarios que pueden resultarnos utiles:
   > 5.a. Put /users/{userId}, para actualizar la información del usuario
   > 5.b. Get /admin/users/{groupName} que solo pueden utilizarla los administradores y es para obtener la lista de usuarios del grupo de pacientes
6. Del mismo modo, solo para administradores, se exponen los distintos endpoints para el management de los grupos.
7. Con el post a /patients/{userId} podemos crear pacientes asociados a ese usuario y con el get /patients/{userId} podemos listar todos los pacientes de un usuario.
8. De nuevo tenemos otras dos peticiones de pacientes que pueden resultarnos utiles:
   > 8.a. put /patients/{patientId} para actualizar un paciente
   > 8.b. get /admin/patients/{groupName}, solo para administradores, para obtener el listado de pacientes del grupo.
9. Ya podemos crear un diagnostico asociado a un paciente con el post /diagnosis/{patientId} o leer todos los diagnosticos asociados a un paciente con el get a /diagnosis/{patientId}
10. Por último, se expone otro endpoint para los administradores para que puedan consultar los diagnósticos de todos los pacientes de su grupo. En este endpoint ademas permitimos filtrar por el nombre del paciente (es un filtro exacto) o por la fecha de creación del diagnostico (indicando un rango de fechas excluyente: start_date > date > end_date).

#### 7. Posibles mejoras y líneas futuras.

Por cuestión de tiempo no se han podido implementar:

> - No se han añadido test unitarios.
> - Para la estandarización de los datos se podría integrar con un servidor de FHIR.
> - No se ha tenido en cuenta que puede que un diagnóstico no tenga una prescripción asociada. Por ahora para "simular" esto se puede enviar un string vacío pero estaría bien contemplar otras opciones.
> - Haber generado un seed inicial para cargar la base de datos en el primer deploy.
> - El filtro de nombres se ha hecho con una condicion exacta (igual), para mejorarlo se podria implementar un "like" (que buscase en mayusculas, minusculas, que contenga un string,que quite caracteres especiales, ...).
