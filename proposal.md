# Propuesta TP DSW

## Grupo
### Integrantes
* 48937 - Bitti Guido
* 51388 - Mora Joaquin


### Repositorios
* [AgroControl-Front](https://github.com/GuidoBitti/AgroControl-Front)
* [AgroControl-Back](https://github.com/GuidoBitti/AgroControl-Back)

## Tema
### Descripción
AgroControl está diseñado para que el productor agropecuario pueda realizar el
seguimiento detallado de sus unidades productivas (lotes) a lo largo de cada campaña. El
sistema permitirá la gestión granular por hectárea, cultivo y variedad de semilla,
centralizando el registro de todas las intervenciones técnicas y el consumo de insumos
(fertilizantes, insecticidas, herbicidas, etc).

### Modelo
<img width="817" height="1074" alt="Modelo_AgroControl drawio" src="https://github.com/user-attachments/assets/3a620bac-63e7-40b7-8f76-de66182adfa2" />

* [Link Imagen](https://drive.google.com/file/d/1E5pnDAzI1D0h6VOgaoaNEFibqgxNcMvc/view?usp=sharing)



## Alcance Funcional 

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Insumo<br>2. CRUD Rol<br>3. CRUD Usuario<br>4. CRUD Lote<br>5. CRUD Campaña<br>6. CRUD Organización|
|CRUD dependiente|1. CRUD Usuario {depende de} CRUD Rol<br>2. CRUD Trabajo {depende de} CRUD Lote, CRUD Insumo, CRUD Usuario y CRUD Organización<br>3. CRUD LoteCampaña {depende de} CRUD Lote y CRUD Campaña<br>4. CRUD Insumo {depende de} Tipo de Insumo|
|Listado<br>+<br>detalle|1. Listado de Lotes. Permite buscar por identificador, número o descripción y muestra hectáreas y coordenadas => Detalle CRUD Lote<br>2. Listado de Insumos. Permite buscar por nombre y muestra nombre, tipo, stock y descripción => Detalle CRUD Insumo<br>3. Listado de Campañas de la organización, filtrable por identificador y fechas. Al seleccionar una campaña, muestra el período y los lotes asignados => Detalle CRUD Campaña<br>4. Listado de Trabajos, filtrable por texto y con información de fechas, lote, usuario, insumo y cantidad utilizada => Detalle CRUD Trabajo|
|CUU/Epic|1. Gestión de usuarios y roles de la organización.<br>2. Gestión de campañas y asignación de lotes a la campaña vigente.<br>3. Registro y consulta de los trabajos realizados en los lotes, incluyendo el usuario responsable y los insumos utilizados.<br>4. Control de stock: ingreso de insumos, descuento al registrar trabajos y validación de stock suficiente.<br>5. Autenticación y acceso a las funciones según el rol y la organización del usuario.|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Cultivo<br>2. CRUD Insumos<br>3. CRUD Campaña <br>4. CRUD Rol <br>5. CRUD Usuario <br>6. CRUD Trabajo <br>7. CRUD Lote <br>8. CRUD Organizacion|
|CUU/Epic|1. Realizar el trabajo realizado en un lote. <br>2. Consultar el historial de la Campaña <br>3. Registrar el ingreso y egreso de stock de insumos|

### Alcance Adicional Voluntario

|Req|Detalle|
|:-|:-|
|Listados |1. Filtrar el listado de insumos por tipo de trabajo y tipo de insumo <br>2. Filtrar el historial de campaña por tipo de cultivo.|
|CUU/Epic|1. Agregar usuarios a la organiacion|
|Otros|1. Envío de stock bajo por mail|
