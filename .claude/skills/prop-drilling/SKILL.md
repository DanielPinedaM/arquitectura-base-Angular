---
name: prop-drilling
description: Prohíbe el prop drilling en componentes Angular. Obliga el patrón data down (input()) / events up (output()) y define las alternativas permitidas cuando un dato debe cruzar componentes intermedios.
when_to_use: Aplicar SIEMPRE que se diseñe, cree, divida, modifique o refactorice un componente, o que se defina cómo se comunican dos componentes. Triggers — "crea un componente", "nuevo componente", "refactoriza este componente", "divide este componente", "extrae un componente", "agrega un input", "agrega un output", "pasa este dato al hijo", "el hijo debe avisar al padre", "comunicar componentes", "mover el estado", "levantar el estado", "crea un wrapper", "crea un layout", "revisa este componente".
---

# Data Down, Events Up

## Regla
PROHIBIDO el prop drilling. Toda comunicación entre componentes usa **data down, events up**.

## Definiciones
* **Data down:** el padre pasa el dato al hijo **directo** con `input()`. El hijo lo consume; nunca lo muta.

* **Events up:** el hijo notifica al padre **directo** con `output()`. El padre es dueño del estado y el único que lo actualiza.

* **Prop drilling (PROHIBIDO):** un `input()` o un `output()` que atraviesa **1 o más componentes intermedios que no lo consumen** y que solo lo reenvían hacia abajo o lo re-emiten hacia arriba.

Un `input()` que el hijo directo sí consume NO es prop drilling. Lo prohibido es el componente de paso.

## Alternativas, en este Orden
1. **Composición, reestructurar el árbol de componentes:** eliminar o reubicar el componente intermedio para que el que produce el dato y el que lo consume queden padre/hijo directos. No usa ninguna API extra, cambia la forma del árbol. Es la opción por defecto.

2. **Content projection con `ng-content`:** cuando el componente intermedio debe existir, que proyecte el contenido en lugar de reenviar `input()`/`output()`. Así el padre queda conectado directamente con el componente que consume el dato.

3. **`@Service()` singleton con signals:** solo si lo anterior no aplica. El estado vive en el service, y cada componente lo inyecta con `inject()` donde lo necesita. PROHIBIDO usar RxJS como contenedor de estado

## Checklist Antes de Escribir el Componente
```
- [ ] 1. Por cada input()/output() nuevo: verificar que el componente que lo declara consume el valor.
- [ ] 2. Si solo lo reenvía o lo re-emite, es prop drilling: no escribirlo.
- [ ] 3. Resolverlo reestructurando el árbol; si el intermedio debe existir, usar ng-content; si nada de eso aplica, mover el estado a un @Service() singleton con signals.
- [ ] 4. Confirmar que el hijo no muta el input(): notifica con output() y el padre decide.
```

## Prohibiciones
* Declarar un `input()` cuyo único uso sea pasarlo a otro componente en el template.

* Declarar un `output()` cuyo único uso sea re-emitir el `output()` de un hijo.

* Mutar dentro del hijo el valor recibido por `input()`.

## Al Refactorizar
Antes de modificar un componente, recorrer la cadena de `input()`/`output()` de arriba abajo y listar los que atraviesan componentes intermedios. Cada uno es una violación y debe eliminarse aplicando las alternativas.
