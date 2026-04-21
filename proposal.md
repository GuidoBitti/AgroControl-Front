# Propuesta TP DSW

## Grupo
### Integrantes
* 48937 - Bitti Guido
* 51388 - Mora Joaquin
* 52724 - Guiu Mariano

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
[Link Imagen](https://drive.google.com/file/d/1E5pnDAzI1D0h6VOgaoaNEFibqgxNcMvc/view?usp=sharing)


## Alcance Funcional 

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Cultivo<br>2. CRUD Insumos<br>3. CRUD Campaña <br>4. CRUD Rol <br>5. CRUD Usuario <br>6. CRUD Trabajo|
|CRUD dependiente|1. CRUD Lote {depende de} CRUD Cultivo<br>2. CRUD Organizacion {depende de} CRUD Rol y CRUD Usuario|
|Listado<br>+<br>detalle| 1. Listado de trabajos. Muestra cultivo, tipo de trabajo, fecha del trabajo, identificador, cantidad de insumos utilizados  => Detalle CRUD Lote<br> 2. Listado de Stock de Insumos. Muestra tipo de insumo, fecha, costo y cantidad de ingreso y egreso de insumos y total por insumo => Detalle CRUD Campaña|
|CUU/Epic|1. Realizar el trabajo realizado en un lote. <br>2. Registrar el ingreso y egreso de stock de insumos|


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
