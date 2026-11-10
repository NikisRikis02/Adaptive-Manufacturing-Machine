# ⚙️ Adaptive Manufacturing Machine — Gemelo Digital & Propuesta

> Estación Inteligente de Mecanizado CNC con visión artificial y sensado en tiempo real que reconoce la pieza y adapta automáticamente sus parámetros de corte en lazo cerrado[cite: 1].

---

### 🎓 Información Académica

- **Institución:** Universidad de San Buenaventura (Sede Bogotá)
- **Programa:** Tecnología en Automatización Industrial
- **Semestre:** Segundo Semestre
- **Asignatura:** Era Digital

---

### 👥 Integrantes

| Nombre Completo | Rol en el Proyecto | Perfil GitHub |
| :--- | :--- | :--- |
| **Nicolás García** | Líder del Proyecto | [@NikisRikis02](https://github.com/NikisRikis02) |
| **Juan Pablo Escobar** | Editor / Documentación | [@juanpablo160](https://github.com/juanpablo160) |

---

### 🚀 Descripción del Proyecto

**Adaptive Manufacturing Machine** es una propuesta tecnológica y simulador digital enfocado en la transición hacia la manufactura inteligente[cite: 1]. A diferencia de los centros de mecanizado convencionales que operan con parámetros rígidos y preprogramados, esta estación integra sensado avanzado y visión artificial para identificar dinámicamente las dimensiones y características del material[cite: 1].

El sistema supervisa continuamente variables críticas del proceso de corte (velocidad de avance, corriente del husillo, RPM y vibración estructural) para autorregular los parámetros operativos en tiempo real, protegiendo las herramientas de desgaste o fractura y eliminando fallos humanos ante cambios de material o desviaciones imprevistas[cite: 1].

> [!NOTE]
> **Referencia Tecnológica:** El proyecto toma como base la **Patente China CN120386187A (2025)** presentada por *Dongguan Temy Numerical Control Machinery*, la cual define métodos de optimización adaptativa en vivo según reconocimiento de piezas y monitoreo de carga[cite: 1].

---

### 🎯 Objetivos

#### Objetivo General
Desarrollar un prototipo de gemelo digital y arquitectura de control para una estación CNC adaptativa capaz de reconocer el material a procesar y ajustar sus parámetros cinemáticos y de potencia en tiempo real[cite: 1].

#### Objetivos Específicos
- **Reconocimiento y Sensado:** Implementar un esquema de escaneo óptico y dimensional (cámara + sensor ToF) para clasificar materiales (Espuma/Balso, MDF, Acrílico duro)[cite: 1, 2].
- **Lazo Cerrado Adaptativo:** Desarrollar la lógica de respuesta para desacelerar el avance y regular RPM al detectar desviaciones o sobrecargas mecánicas[cite: 1, 2].
- **Supervisión en Tiempo Real:** Diseñar una interfaz interactiva con osciloscopio en vivo para supervisar la respuesta dinámica del avance versus la corriente[cite: 1].
- **Gemelo Digital Interactivo:** Modelar la estación CNC en HTML5 Canvas con animación en tiempo real del cabezal, desprendimiento de virutas y mordazas de sujeción[cite: 1, 2].

---

### 🔄 Flujo Operativo del Sistema (5 Etapas)

1. **Identificación:** La cámara y sensores ópticos leen el material y grosor de la pieza[cite: 1].
2. **Determinación:** El sistema calcula la configuración óptima en la matriz de corte[cite: 1].
3. **Ajuste:** Seteo automático de velocidad (RPM), avance ($mm/s$) y fuerza de corte[cite: 1].
4. **Supervisión en vivo:** Monitoreo constante de la corriente del husillo y aceleración de vibración estructural[cite: 1].
5. **Lazo Cerrado:** Si se detecta un nudo duro o esfuerzo excesivo, se activa la corrección activa reduciendo el avance hasta en un 52% y ajustando RPM para salvaguardar la broca[cite: 1, 2].

---

### 🛠️ Stack Tecnológico

| Capa / Módulo | Tecnologías |
| :--- | :--- |
| **Simulador & Gemelo Digital** | HTML5, CSS3 moderno, JavaScript (Canvas API 2D) |
| **Diseño y Control Visual** | Osciloscopio vectorial, dashboards de telemetría reactiva[cite: 1] |
| **Control de Versiones** | Git, GitHub |
| **Entorno de Trabajo** | Visual Studio Code |

---

### 📂 Estructura del Repositorio

```bash
├── index.html          # Panel principal, gemelo digital y documentación técnica[cite: 1]
├── estilos.css         # Paleta técnica oscura y estilos modulares[cite: 3]
├── script.js           # Lógica cinemática, osciloscopio y lazo adaptativo[cite: 2]
└── README.md           # Memoria y documentación oficial en GitHub
