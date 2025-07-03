// script.js

// Get references to HTML elements
const addContactForm = document.getElementById('add-contact-form');
const contactNameInput = document.getElementById('contact-name');
const contactPhoneInput = document.getElementById('contact-phone');
const contactEmailInput = document.getElementById('contact-email');
const contactAddressInput = document.getElementById('contact-address');
const contactListTableBody = document.getElementById('contact-list');
const searchInput = document.getElementById('search-input');
const noContactsMessage = document.getElementById('no-contacts-message');

// Edit Modal elements
const editContactModal = document.getElementById('edit-contact-modal');
const editContactForm = document.getElementById('edit-contact-form');
const editContactIdInput = document.getElementById('edit-contact-id');
const editNameInput = document.getElementById('edit-name');
const editPhoneInput = document.getElementById('edit-phone');
const editEmailInput = document.getElementById('edit-email');
const editAddressInput = document.getElementById('edit-address');
const cancelEditBtn = document.getElementById('cancel-edit-btn');

// Delete Confirmation Modal elements
const deleteConfirmModal = document.getElementById('delete-confirm-modal');
const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
const cancelDeleteBtn = document.getElementById('cancel-delete-btn');

// Array to store contacts
let contacts = [];
let contactToDeleteId = null; // To store the ID of the contact to be deleted

/**
 * Loads contacts from localStorage.
 * If no contacts are found, initializes an empty array.
 */
function loadContacts() {
    const storedContacts = localStorage.getItem('contacts');
    if (storedContacts) {
        contacts = JSON.parse(storedContacts);
    } else {
        contacts = [];
    }
    renderContacts(); // Render contacts after loading
}

/**
 * Saves the current contacts array to localStorage.
 */
function saveContacts() {
    localStorage.setItem('contacts', JSON.stringify(contacts));
}

/**
 * Renders the list of contacts in the table.
 * @param {Array} [filteredContacts=contacts] - Optional array of contacts to render (for search results).
 */
function renderContacts(filteredContacts = contacts) {
    contactListTableBody.innerHTML = ''; // Clear existing list

    if (filteredContacts.length === 0) {
        noContactsMessage.classList.remove('hidden');
    } else {
        noContactsMessage.classList.add('hidden');
        filteredContacts.forEach(contact => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50 transition duration-150 ease-in-out';
            row.innerHTML = `
                <td class="py-3 px-4" data-label="Name">${contact.name}</td>
                <td class="py-3 px-4" data-label="Phone">${contact.phone}</td>
                <td class="py-3 px-4 hidden md:table-cell" data-label="Email">${contact.email || '-'}</td>
                <td class="py-3 px-4 hidden lg:table-cell" data-label="Address">${contact.address || '-'}</td>
                <td class="py-3 px-4 action-buttons">
                    <button class="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-3 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 edit-btn" data-id="${contact.id}" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 delete-btn" data-id="${contact.id}" title="Delete">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            `;
            contactListTableBody.appendChild(row);
        });
    }

    // Add event listeners to newly created edit and delete buttons
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', (event) => openEditModal(event.currentTarget.dataset.id));
    });
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (event) => openDeleteConfirmModal(event.currentTarget.dataset.id));
    });
}

/**
 * Handles the submission of the add contact form.
 * @param {Event} event - The form submission event.
 */
function addContact(event) {
    event.preventDefault(); // Prevent default form submission

    const newContact = {
        id: Date.now().toString(), // Simple unique ID
        name: contactNameInput.value.trim(),
        phone: contactPhoneInput.value.trim(),
        email: contactEmailInput.value.trim(),
        address: contactAddressInput.value.trim()
    };

    if (newContact.name && newContact.phone) {
        contacts.push(newContact);
        saveContacts();
        renderContacts();
        addContactForm.reset(); // Clear the form
    } else {
        // In a real application, you might show a more user-friendly error message
        console.error('Name and Phone Number are required.');
    }
}

/**
 * Filters contacts based on the search input.
 */
function searchContacts() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const filtered = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm) ||
        contact.phone.toLowerCase().includes(searchTerm)
    );
    renderContacts(filtered);
}

/**
 * Opens the edit contact modal and populates it with contact data.
 * @param {string} id - The ID of the contact to edit.
 */
function openEditModal(id) {
    const contactToEdit = contacts.find(contact => contact.id === id);
    if (contactToEdit) {
        editContactIdInput.value = contactToEdit.id;
        editNameInput.value = contactToEdit.name;
        editPhoneInput.value = contactToEdit.phone;
        editEmailInput.value = contactToEdit.email;
        editAddressInput.value = contactToEdit.address;
        editContactModal.classList.remove('hidden');
    }
}

/**
 * Closes the edit contact modal.
 */
function closeEditModal() {
    editContactModal.classList.add('hidden');
    editContactForm.reset();
}

/**
 * Handles the submission of the edit contact form.
 * @param {Event} event - The form submission event.
 */
function updateContact(event) {
    event.preventDefault();

    const updatedContact = {
        id: editContactIdInput.value,
        name: editNameInput.value.trim(),
        phone: editPhoneInput.value.trim(),
        email: editEmailInput.value.trim(),
        address: editAddressInput.value.trim()
    };

    if (updatedContact.name && updatedContact.phone) {
        contacts = contacts.map(contact =>
            contact.id === updatedContact.id ? updatedContact : contact
        );
        saveContacts();
        renderContacts();
        closeEditModal();
    } else {
        console.error('Name and Phone Number are required for update.');
    }
}

/**
 * Opens the delete confirmation modal.
 * @param {string} id - The ID of the contact to be deleted.
 */
function openDeleteConfirmModal(id) {
    contactToDeleteId = id;
    deleteConfirmModal.classList.remove('hidden');
}

/**
 * Closes the delete confirmation modal.
 */
function closeDeleteConfirmModal() {
    contactToDeleteId = null;
    deleteConfirmModal.classList.add('hidden');
}

/**
 * Deletes a contact after confirmation.
 */
function deleteContact() {
    if (contactToDeleteId) {
        contacts = contacts.filter(contact => contact.id !== contactToDeleteId);
        saveContacts();
        renderContacts();
        closeDeleteConfirmModal();
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', loadContacts); // Load contacts when the page loads
addContactForm.addEventListener('submit', addContact);
searchInput.addEventListener('keyup', searchContacts); // Search as user types

// Edit Modal Listeners
editContactForm.addEventListener('submit', updateContact);
cancelEditBtn.addEventListener('click', closeEditModal);

// Delete Confirmation Modal Listeners
confirmDeleteBtn.addEventListener('click', deleteContact);
cancelDeleteBtn.addEventListener('click', closeDeleteConfirmModal);

// Close modals if clicked outside (optional, but good for UX)
window.addEventListener('click', (event) => {
    if (event.target === editContactModal) {
        closeEditModal();
    }
    if (event.target === deleteConfirmModal) {
        closeDeleteConfirmModal();
    }
});
