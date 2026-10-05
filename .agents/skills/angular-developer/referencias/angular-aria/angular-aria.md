# Angular Aria

Angular Aria (`@angular/aria`) es una colección de directivas headless y accesibles que implementan patrones comunes de WAI-ARIA. Estas directivas manejan las interacciones con el teclado, los atributos ARIA, la gestión del foco y el soporte para lectores de pantalla.

**Como agente de IA, tu rol es proporcionar la estructura HTML y los estilos CSS**, mientras que las directivas manejan la lógica compleja de accesibilidad.

## Estilos de componentes headless

Como los componentes de Angular Aria son headless, no incluyen estilos por defecto. **Debes** usar CSS para dar estilo a los diferentes estados según los atributos ARIA o las clases estructurales que las directivas aplican automáticamente.

Atributos ARIA comunes a los que apuntar en CSS:

- `[aria-expanded="true"]` / `[aria-expanded="false"]`
- `[aria-selected="true"]`
- `[aria-disabled="true"]`
- `[aria-current="page"]` (para la navegación)

---

**CRÍTICO**: Antes de usar este paquete, confirma que `@angular/aria` esté instalado. Si es necesario, instálalo usando el gestor de paquetes configurado para el proyecto.

## 1. Accordion

Organiza el contenido relacionado en secciones expandibles/colapsables.

**Uso:** El Accordion es un componente de layout diseñado para organizar el contenido en grupos lógicos que los usuarios pueden expandir de uno en uno para reducir el scroll en páginas con mucho contenido. Úsalo para FAQs, formularios largos o la revelación progresiva de información, pero evítalo para la navegación principal o en escenarios donde los usuarios deban ver múltiples secciones de contenido simultáneamente.

**Imports:** `import { AccordionContent, AccordionGroup, AccordionPanel, AccordionTrigger } from '@angular/aria/accordion';`

**Directivas:** `ngAccordionGroup`, `ngAccordionTrigger`, `ngAccordionPanel`, `ngAccordionContent` (para lazy loading).

```ts
@Component({
  selector: 'app-cmp',
  imports: [AccordionContent, AccordionGroup, AccordionPanel, AccordionTrigger],
  template: `...`,
  styles: [],
})
export class App {
  protected readonly title = signal('angular-app');
}
```

```html
<div ngAccordionGroup [multiExpandable]="false">
  <div class="accordion-item">
    <button ngAccordionTrigger [panel]="panel1" class="accordion-header">
      Section 1
      <span class="icon">▼</span>
    </button>
    <div ngAccordionPanel #panel1="ngAccordionPanel" class="accordion-panel">
      <ng-template ngAccordionContent>
        <p>Lazy loaded content here.</p>
      </ng-template>
    </div>
  </div>
</div>
```

**Estrategia de estilos:**
Apunta al atributo `[aria-expanded]` del trigger para rotar los íconos, y da estilo a la visibilidad del panel.

```css
.accordion-header[aria-expanded='true'] .icon {
  transform: rotate(180deg);
}

/* La directiva del panel maneja la eliminación del DOM, pero puedes darle estilo a la transición */
.accordion-panel {
  padding: 1rem;
  border-top: 1px solid #ccc;
}
```

---

## 2. Listbox

Una directiva fundamental para mostrar una lista de opciones. Se usa para listas de selección visibles (no dropdowns).

**Uso:** Listas seleccionables visibles (selección única o múltiple).

**Imports:** `import {Listbox, Option} from '@angular/aria/listbox';`

**Directivas:** `ngListbox`, `ngOption`.

```ts
@Component({
  selector: 'app-cmp',
  imports: [Listbox, Option],
  template: `...`,
  styles: [],
})
export class App {
  protected readonly title = signal('angular-app');
}
```

```html
<!-- orientación horizontal o vertical -->
<ul ngListbox [(value)]="selectedItems" orientation="horizontal" [multi]="true">
  <li ngOption value="apple" class="option">Apple</li>
  <li ngOption value="banana" class="option">Banana</li>
</ul>
```

**Estrategia de estilos:**
Apunta a `[aria-selected="true"]` para el estado seleccionado y a `:focus-visible` o `[data-active]` para el elemento con foco (Angular Aria usa roving tabindex o activedescendant).

```css
.option {
  padding: 8px;
  cursor: pointer;
}
.option[aria-selected='true'] {
  background: #e0f7fa;
  font-weight: bold;
}
/* Estado de foco gestionado por aria */
.option:focus-visible {
  outline: 2px solid blue;
}
```

---

## 3. Combobox, Select y Multiselect

Estos patrones combinan la directiva `ngCombobox` (aplicada directamente al elemento trigger/combobox) con un popup que contiene un widget `ngListbox`.

- **Combobox (Autocomplete)**: Se aplica a un elemento `<input ngCombobox>`. Ideal cuando escribir filtra la lista.
- **Select**: Se aplica a un wrapper que puede recibir el foco, como un elemento `<div ngCombobox>` o `<button ngCombobox>`. Los usuarios seleccionan de una lista de opciones.
- **Multiselect**: Un Combobox o Select combinado con un `ngListbox` de selección múltiple.

**Imports:**

```ts
import {Combobox, ComboboxPopup, ComboboxWidget} from '@angular/aria/combobox';
import {Listbox, Option} from '@angular/aria/listbox';
```

**Directivas:** `ngCombobox`, `ngComboboxPopup`, `ngComboboxWidget`, `ngListbox`, `ngOption`.

```html
<!-- Ejemplo 1: Autocomplete estándar -->
<div>
  <input
    ngCombobox
    #combobox="ngCombobox"
    [(value)]="searchString"
    [(expanded)]="isExpanded"
    placeholder="Search options..."
    class="select-trigger"
  />

  <ng-template ngComboboxPopup [combobox]="combobox">
    <ul
      ngComboboxWidget
      ngListbox
      #listbox="ngListbox"
      [(value)]="selectedValue"
      [activeDescendant]="listbox.activeDescendant()"
      class="dropdown-menu"
    >
      <li ngOption value="option1" label="Option 1" class="option">Option 1</li>
      <li ngOption value="option2" label="Option 2" class="option">Option 2</li>
    </ul>
  </ng-template>
</div>

<!-- Ejemplo 2: Componente Select (aplicado directamente a un trigger div) -->
<div ngCombobox #select="ngCombobox" [(expanded)]="selectExpanded" class="select-trigger">
  <span class="select-text">{{ selectedValue() ?? 'Choose an option' }}</span>
  <span class="icon">▼</span>
</div>

<ng-template ngComboboxPopup [combobox]="select">
  <ul
    ngComboboxWidget
    ngListbox
    #selectListbox="ngListbox"
    [(value)]="selectedValues"
    [activeDescendant]="selectListbox.activeDescendant()"
    (click)="onCommit()"
    (keydown.enter)="onCommit()"
    class="dropdown-menu"
  >
    <li ngOption value="option1" label="Option 1" class="option">Option 1</li>
    <li ngOption value="option2" label="Option 2" class="option">Option 2</li>
  </ul>
</ng-template>
```

**Estrategia de estilos:**
Da estilo al contenedor del popup para que se vea como un dropdown flotando sobre el contenido (a menudo combinado con CDK Overlay).

```css
.select-trigger {
  width: 200px;
  padding: 8px;
  text-align: left;
}
.dropdown-menu {
  list-style: none;
  padding: 0;
  margin: 0;
  border: 1px solid #ccc;
  background: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

---

## 4. Menu y Menubar

Para acciones, comandos y menús contextuales (no para la selección en formularios).

**Uso:** El Menubar es un patrón de navegación de alto nivel diseñado para construir barras de comandos de aplicación al estilo de escritorio (p. ej., File, Edit, View) que permanecen persistentes a lo largo de una interfaz. Se aprovecha mejor para organizar comandos complejos en categorías lógicas de nivel superior con soporte completo de teclado horizontal, pero debe evitarse para listas de acciones simples e independientes o para layouts mobile-first donde el espacio horizontal es limitado.

**Imports:** `import {MenuBar, Menu, MenuContent, MenuItem, MenuTrigger} from '@angular/aria/menu';`

**Directivas:** `ngMenuBar`, `ngMenu`, `ngMenuItem`, `ngMenuTrigger`, `ngMenuContent`.

```html
<!-- Ejemplo de Menubar -->
<div ngMenuBar class="menubar">
  <div ngMenuItem value="file" [submenu]="fileMenu" class="menubar-item">File</div>
  <div ngMenuItem value="edit" [submenu]="editMenu" class="menubar-item">Edit</div>
</div>

<div ngMenu #fileMenu="ngMenu" class="menu">
  <ng-template ngMenuContent>
    <div ngMenuItem value="new">New</div>
    <div ngMenuItem value="open">Open</div>
  </ng-template>
</div>

<div ngMenu #editMenu="ngMenu" class="menu">
  <ng-template ngMenuContent>
    <div ngMenuItem value="cut">Cut</div>
    <div ngMenuItem value="copy">Copy</div>
  </ng-template>
</div>
```

**Estrategia de estilos:**
Usa flexbox para el menubar. Oculta/muestra los submenús según el estado del trigger.

```css
.menubar {
  display: flex;
  gap: 10px;
  list-style: none;
  padding: 0;
}
.menu {
  background: white;
  border: 1px solid #ccc;
  padding: 5px 0;
}
.menu li {
  padding: 5px 15px;
  cursor: pointer;
}
```

---

## 5. Tabs

Secciones de contenido superpuestas donde solo un panel es visible.

**Uso:** El componente Tabs se usa para organizar contenido relacionado en secciones distintas y navegables, permitiendo a los usuarios cambiar entre categorías o vistas sin salir de la página. Es ideal para paneles de configuración, documentación de múltiples temas o dashboards, pero debe evitarse para flujos de trabajo secuenciales (steppers) o cuando la navegación involucra más de 7–8 secciones.

**Imports:** `import {Tab, Tabs, TabList, TabPanel, TabContent} from '@angular/aria/tabs';`

**Directivas:** `ngTabs`, `ngTabList`, `ngTab`, `ngTabPanel`, `ngTabContent`.

```html
<div ngTabs>
  <ul ngTabList [(selectedTab)]="selectedTabValue" class="tab-list">
    <li ngTab value="profile" class="tab-btn">Profile</li>
    <li ngTab value="security" class="tab-btn">Security</li>
  </ul>

  <div ngTabPanel value="profile" class="tab-panel">
    <ng-template ngTabContent>Profile Settings</ng-template>
  </div>
  <div ngTabPanel value="security" class="tab-panel">
    <ng-template ngTabContent>Security Settings</ng-template>
  </div>
</div>
```

**Estrategia de estilos:**
Apunta a `[aria-selected="true"]` en los botones de las pestañas.

```css
.tab-list {
  display: flex;
  border-bottom: 2px solid #ccc;
  list-style: none;
  padding: 0;
}
.tab-btn {
  padding: 10px 20px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
}
.tab-btn[aria-selected='true'] {
  border-bottom-color: blue;
  font-weight: bold;
}
.tab-panel {
  padding: 20px;
}
```

---

## 6. Toolbar

Agrupa controles relacionados (como el formato de texto).

**Uso:** El Toolbar es un componente organizacional diseñado para agrupar controles relacionados y de acceso frecuente en un único contenedor lógico. Se usa mejor para mejorar la eficiencia del teclado (mediante la navegación con las teclas de flecha) y la estructura visual en flujos de trabajo que requieren acciones repetidas, como el formato de texto o los controles multimedia.

**Imports:** `import {Toolbar, ToolbarWidget, ToolbarWidgetGroup} from '@angular/aria/toolbar';`

**Directivas:** `ngToolbar`, `ngToolbarWidget`, `ngToolbarWidgetGroup`.

```html
<div ngToolbar class="toolbar">
  <div ngToolbarWidgetGroup role="group" aria-label="Formatting">
    <button
      ngToolbarWidget
      type="button"
      [attr.aria-pressed]="bold()"
      (click)="bold.set(!bold())"
      class="tool-btn"
    >
      B
    </button>
    <button
      ngToolbarWidget
      type="button"
      [attr.aria-pressed]="italic()"
      (click)="italic.set(!italic())"
      class="tool-btn"
    >
      I
    </button>
  </div>
</div>
```

**Estrategia de estilos:**
Apunta a `[aria-pressed="true"]` (para los toggle buttons) o a `[aria-checked="true"]` (para los radio groups) dentro del toolbar.

```css
.toolbar {
  display: flex;
  gap: 5px;
  padding: 8px;
  background: #f5f5f5;
}
.tool-btn {
  padding: 5px 10px;
  border: 1px solid #ccc;
}
.tool-btn[aria-pressed='true'],
.tool-btn[aria-checked='true'] {
  background: #ddd;
}
```

---

## 7. Tree

Muestra datos jerárquicos (sistemas de archivos, navegación anidada).

**Uso:** El componente Tree está diseñado para navegar y mostrar estructuras de datos jerárquicas y profundamente anidadas, como sistemas de archivos, organigramas o arquitecturas de sitios complejas. Debe usarse específicamente para relaciones de múltiples niveles donde los usuarios necesitan expandir o colapsar ramas, pero debe evitarse para listas planas, tablas de datos o menús de selección simples.

**Imports:** `import {Tree, TreeItem, TreeItemGroup} from '@angular/aria/tree';`

**Directivas:** `ngTree`, `ngTreeItem`, `ngTreeItemGroup`.

```html
<ul ngTree #tree="ngTree" [(value)]="selectedValues" class="tree">
  <li ngTreeItem [parent]="tree" value="documents" #docsItem="ngTreeItem">
    <span class="tree-label">Documents</span>
    <ul role="group">
      <ng-template ngTreeItemGroup [ownedBy]="docsItem" #docsGroup="ngTreeItemGroup">
        <li ngTreeItem [parent]="docsGroup" value="resume">Resume.pdf</li>
        <li ngTreeItem [parent]="docsGroup" value="cover-letter">CoverLetter.pdf</li>
      </ng-template>
    </ul>
  </li>
</ul>
```

**Estrategia de estilos:**
Apunta a `[aria-expanded]` para mostrar/ocultar los hijos o rotar los íconos chevron. Usa `padding-left` en los grupos anidados para mostrar la jerarquía.

```css
.tree,
.tree-group {
  list-style: none;
  padding-left: 20px;
}
.tree-label::before {
  content: '▶ ';
  display: inline-block;
  transition: transform 0.2s;
}
li[aria-expanded='true'] > .tree-label::before {
  transform: rotate(90deg);
}
```

## 8. Grid

Una colección interactiva bidimensional de celdas que permite la navegación mediante las teclas de flecha.

**Uso:** Tablas de datos, calendarios, hojas de cálculo y patrones de layout para elementos interactivos.
**Directivas:** `ngGrid`, `ngGridRow`, `ngGridCell`, `ngGridCellWidget`.

```html
<table ngGrid [multi]="true" [enableSelection]="true" class="grid-table">
  <tr ngGridRow>
    <th ngGridCell role="columnheader">Name</th>
    <th ngGridCell role="columnheader">Status</th>
  </tr>
  <tr ngGridRow>
    <td ngGridCell>Project A</td>
    <td ngGridCell [(selected)]="isSelected">
      <button ngGridCellWidget (activated)="onActivate()">Active</button>
    </td>
  </tr>
</table>
```

**Estrategia de estilos:**
Apunta a `[aria-selected="true"]` para las celdas seleccionadas y a `:focus-visible` para la celda activa (roving tabindex) o a `[aria-activedescendant]` en el contenedor.

```css
.grid-table {
  border-collapse: collapse;
}
[ngGridCell] {
  padding: 8px;
  border: 1px solid #ddd;
}
[ngGridCell][aria-selected='true'] {
  background: #e3f2fd;
}
/* Estado de foco gestionado por roving tabindex */
[ngGridCell]:focus-visible {
  outline: 2px solid #2196f3;
  outline-offset: -2px;
}
```

## 9. Testing con Component Harnesses

Angular Aria proporciona Component Harnesses estándar (basados en `@angular/cdk/testing`) para que el unit testing sea limpio, robusto y desacoplado de los detalles estructurales del DOM.

**Imports:**

```ts
import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {AccordionGroupHarness, AccordionHarness} from '@angular/aria/accordion/testing';
import {ListboxHarness, ListboxOptionHarness} from '@angular/aria/listbox/testing';
```

### Ejemplo: Testing de un Accordion con harnesses

```ts
describe('MyAccordionComponent', () => {
  let fixture: ComponentFixture<MyAccordionComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    fixture = TestBed.createComponent(MyAccordionComponent);
    await fixture.whenStable();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should expand accordion on toggle', async () => {
    // Obtén el harness por el título de su trigger
    const accordion = await loader.getHarness(AccordionHarness.with({title: 'Section 1'}));

    expect(await accordion.isExpanded()).toBeFalse();

    // Expande el accordion
    await accordion.expand();

    expect(await accordion.isExpanded()).toBeTrue();
  });
});
```

## 10. Integración con Signal Forms

Como las directivas de Angular Aria aprovechan los signals modernos `model()` de Angular para gestionar los valores interactivos, se integran **de forma inmediata** con los nuevos Signal Forms de Angular (`@angular/forms/signals`).

La directiva `[formField]` detecta automáticamente directivas como `ngCombobox` o `ngListbox` como controles de formulario personalizados porque exponen un model `value`.

**Imports:**

```ts
import {form, schema, required} from '@angular/forms/signals';
import {Combobox, ComboboxPopup, ComboboxWidget} from '@angular/aria/combobox';
import {Listbox, Option} from '@angular/aria/listbox';
```

### Ejemplo 1: Combobox de autocompletado dentro de un formulario

Dado un modelo de formulario definido en tu componente:

```ts
protected readonly citySignal = signal({name: '', city: ''});
protected readonly myForm = form(this.citySignal, schema(f => {
  required(f.city);
}));
```

Haces binding directamente usando `[formField]`:

```html
<div>
  <label for="city-input">Choose your city:</label>
  <input
    id="city-input"
    ngCombobox
    #combobox="ngCombobox"
    [formField]="myForm.city"
    [(expanded)]="isExpanded"
    placeholder="Search cities..."
  />

  <ng-template ngComboboxPopup [combobox]="combobox">
    <ul
      ngComboboxWidget
      ngListbox
      #listbox="ngListbox"
      [(value)]="selectedValue"
      [activeDescendant]="listbox.activeDescendant()"
      class="dropdown-menu"
    >
      <li ngOption value="sfo" label="San Francisco">San Francisco</li>
      <li ngOption value="nyc" label="New York">New York</li>
    </ul>
  </ng-template>
</div>
```

### Ejemplo 2: Componente Select dentro de un formulario

Aplica `ngCombobox` directamente a un trigger `div` que pueda recibir el foco y haz binding a `[formField]`:

```html
<div>
  <label for="city-select">Choose your city:</label>
  <div
    id="city-select"
    ngCombobox
    #select="ngCombobox"
    [formField]="myForm.city"
    [(expanded)]="isExpanded"
    class="select-trigger"
  >
    <span class="select-text">{{ myForm.city.value() || 'Choose your city' }}</span>
    <span class="icon">▼</span>
  </div>

  <ng-template ngComboboxPopup [combobox]="select">
    <ul
      ngComboboxWidget
      ngListbox
      #selectListbox="ngListbox"
      [(value)]="selectedValues"
      [activeDescendant]="selectListbox.activeDescendant()"
      (click)="onCommit()"
      (keydown.enter)="onCommit()"
      class="dropdown-menu"
    >
      <li ngOption value="sfo" label="San Francisco">San Francisco</li>
      <li ngOption value="nyc" label="New York">New York</li>
    </ul>
  </ng-template>
</div>
```

### Ejemplo 3: Listbox standalone (selección múltiple) dentro de un formulario

Puedes hacer binding de un Listbox de selección múltiple directamente a un array del formulario:

```html
<ul ngListbox [formField]="myForm.interests" [multi]="true" class="interest-list">
  <li ngOption value="sports">Sports</li>
  <li ngOption value="music">Music</li>
  <li ngOption value="tech">Technology</li>
</ul>
```

## Reglas generales para agentes

1. **Nunca uses elementos HTML nativos como `<select>`** cuando se te pida implementar estos patrones específicos de Aria. Usa las directivas `ng*`.
2. **Maneja el CSS manualmente**: Recuerda que `Angular Aria` NO proporciona estilos. Debes escribir el CSS apuntando a los atributos ARIA nativos (`aria-expanded`, `aria-selected`, etc.) que las directivas alternan automáticamente.
3. **Lazy loading**: Usa siempre las directivas estructurales proporcionadas (`ngAccordionContent`, `ngTabContent`, `ngMenuContent`, `ngComboboxPopup`, `ngTreeItemGroup`) dentro de `ng-template` para los paneles de contenido pesado o los grupos anidados, para asegurar que se rendericen de forma lazy.
