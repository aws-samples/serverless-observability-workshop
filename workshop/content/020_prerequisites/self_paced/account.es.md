---
title: "Crear una cuenta AWS"
chapter: false
weight: 1
---

{{% notice warning %}}
Tu cuenta debe tener la capacidad de crear nuevas funciones del IAM y alcanzar otros permisos del IAM. 
{{% /notice %}}

1. Si todavía no estás registrado en AWS con acceso de administrador:[ haz clic aquí y regístrate ahora 
](https://aws.amazon.com/getting-started/)

1. Asegúrate de estar siguiendo todos los pasos restantes del workshop como usuario del IAM con acceso de administrador a la cuenta de AWS.

1. [Accede la consola de gestión de IAM](https://console.aws.amazon.com/iam/home?#/users$new)

1. A la izquierda en la navegación, selecciona **Users**, y haz clic en el botón **Add User**.

1. Introduce los datos del usuario:
![Create User](/images/iam-1-create-user.png)

1. Adjunta la política de IAM AdministratorAccess y haz clic en **Next: Tags**
![Attach Policy](/images/iam-2-attach-policy.png)

1. Saltamos la incorporación de tags para el workshop. Haz clic en **Next: Review**

1. Haz clic para crear el nuevo usuario:
![Confirm User](/images/iam-3-create-user.png)

1. Toma nota de la URL de inicio de sesión y guárdala para utilizarla en el futuro:
![Login URL](/images/iam-4-save-url.png)

1. Haz clic en esta URL para acceder a la página de inicio de sesión de la Consola de Gestión de AWS, utilizando el nombre de usuario y la contraseña del `workshop` que acabas de crear. 

Tras la conclusión de esta etapa, puedes acceder a  [**Crear un Workspace**](../../workspace/workspace)