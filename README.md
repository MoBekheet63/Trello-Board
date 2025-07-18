# 🚀 Trello Board

A modern, responsive Trello-like kanban board built with Angular, Angular Material, Tailwind CSS, and Angular CDK. Implements all requirements from the provided Figma design and assessment task.

---

## 🎯 Objective

Implement a Trello-style Board page with full drag-and-drop, responsive design, and interactive task/list management.

---

## 🛠 Tech Stack

- **Framework:** Angular 19+ (standalone components)
- **UI:** Angular Material, Tailwind CSS, SCSS
- **Drag & Drop:** Angular CDK
- **Language:** TypeScript
- **State:** RxJS, LocalStorage

---

## ✨ Features

- **Trello-style Board:** Add, edit, delete, and reorder lists and tasks.
- **Drag & Drop:** Move tasks between lists and reorder lists with smooth animations.
- **Priority Badges:** Tasks have colored priority badges (Critical, High, Medium, Low).
- **Responsive:** Fully responsive for desktop, tablet, and mobile.
- **Dialogs:** Modern, mobile-friendly dialogs for all CRUD operations.
- **Visual Feedback:** Animations, hover effects, and clear UI feedback.
- **Persistence:** All data saved in browser LocalStorage.
- **Accessibility:** Keyboard navigation and screen reader support.

---

## 📦 Project Structure

- `src/app/pages/board/` – Main board component
- `src/app/pages/components/list/` – List component
- `src/app/pages/components/task-card/` – Task card component
- `src/app/shared/dialogs/` – Dialogs for add/edit/delete/move
- `src/app/models/` – TypeScript interfaces for Board, List, Task
- `src/app/services/` – Board and storage services

---

## 🚀 Getting Started

### 1. **Clone the repository**
```bash
git clone https://github.com/MoBekheet63/Trello-Board.git
cd TrelloBoard
```

### 2. **Install dependencies**
```bash
npm install
```

### 3. **Run the app**
```bash
npm start
```
أو
```bash
ng serve
```

### 4. **Open in browser**
Go to [http://localhost:4200](http://localhost:4200)

---

## 📝 Implementation Notes

- Uses Angular standalone components and signals for modern best practices.
- All dialogs and UI elements are fully responsive and touch-friendly.
- Drag-and-drop is implemented using Angular CDK for both lists and tasks.
- Priority badges are shown on cards and in task details as per Figma.
- All state is persisted in LocalStorage for demo purposes.
- Uses both Angular Material and Tailwind CSS for best-in-class UI/UX.
- SCSS is used for custom styling where needed.

---

## 📋 Assessment Checklist

- [x] Figma design adherence
- [x] Drag-and-drop for lists and tasks
- [x] Responsive design (desktop, tablet, mobile)
- [x] Add/edit/delete for lists and tasks
- [x] Visual feedback and accessibility
- [x] Clean, maintainable code structure

---

## 📢 Contact

- Email: mahmoud.bekheet63@gmail.com
- Or open an issue on the repository.
