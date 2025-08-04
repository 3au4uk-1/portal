// Класс для управления формой
class FormManager {
    constructor() {
        this.form = document.getElementById('dataForm');
        this.uploadedFiles = [];
        this.managers = {
            arenda: [
                { value: '48085', text: 'Гладков Даниил' },
                { value: '54831', text: 'Кочуренко Софья' },
                { value: '75415', text: 'Феоктистова Любовь' },
                { value: '70671', text: 'Мевшина Дарья' },
                { value: '74343', text: 'Карпов Андрей' },
                { value: '61173', text: 'Лучинова Анна' },
                { value: '68125', text: 'Шапурова Ольга' },
                { value: '67033', text: 'Илларионов Даниил' },
                { value: '77953', text: 'Малинин Георгий' }
            ],
            pro: [
                { value: '33857', text: 'Пахомова Анастасия' },
                { value: '48613', text: 'Шунькин Максим' },
                { value: '80275', text: 'Стародецкий Дмитрий' },
                { value: '81713', text: 'Черная Александра' },
                { value: '82793', text: 'Лопатина Зинаида' },
                { value: '82791', text: 'Подсизерцева Валерия' },
                { value: '20601', text: 'Титова Дарья' },
                { value: '51109', text: 'Каплуненко Анастасия' },
                { value: '79701', text: 'Замалетдинов Александр' },
                { value: '81701', text: 'Котов Владислав' },
                { value: '81699', text: 'Крапчатая Диана' },
                { value: '81703', text: 'Босецкий Кирилл' }
            ],
            art: [
                { value: '4460', text: 'Лоскутникова Татьяна' },
                { value: '48639', text: 'Черноморова Виктория' },
                { value: '65367', text: 'Шелонина Алевтина' },
                { value: '69305', text: 'Зайцева Ксения' },
                { value: '70297', text: 'Будаева Полина' },
                { value: '72255', text: 'Петрикова Яна' },
                { value: '75031', text: 'Швецова Валерия' },
                { value: '75923', text: 'Юсупова Юлия' },
                { value: '75925', text: 'Коротких Анастасия' },
                { value: '75097', text: 'Романова Дарья' },
                { value: '72797', text: 'Нархова Александра' }
            ]
        };
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupCompanyManagerLogic();
        this.setupPhoneValidation();
        this.setupDateValidation();
        this.setupFileUpload();
        this.setupConditionalSections();
    }

    // Настройка обработчиков событий
    setupEventListeners() {
        // Обработка отправки формы
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Обработка изменений в чекбоксах направлений
        const directionCheckboxes = document.querySelectorAll('input[name="directions"]');
        directionCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => this.toggleConditionalSections());
        });
    }

    // Настройка логики компания-менеджер
    setupCompanyManagerLogic() {
        const companySelect = document.getElementById('company');
        const managerSelect = document.getElementById('manager');

        companySelect.addEventListener('change', (e) => {
            const selectedCompany = e.target.value;
            this.updateManagersList(selectedCompany);
        });
    }

    // Обновление списка менеджеров в зависимости от выбранной компании
    updateManagersList(companyValue) {
        const managerSelect = document.getElementById('manager');
        
        // Очищаем текущий список менеджеров
        managerSelect.innerHTML = '';
        
        if (!companyValue) {
            // Если компания не выбрана, отключаем выбор менеджера
            managerSelect.disabled = true;
            managerSelect.innerHTML = '<option value="">Сначала выберите компанию</option>';
            return;
        }
        
        // Включаем выбор менеджера и добавляем опцию по умолчанию
        managerSelect.disabled = false;
        managerSelect.innerHTML = '<option value="">Выберите менеджера</option>';
        
        // Добавляем менеджеров для выбранной компании
        if (this.managers[companyValue]) {
            this.managers[companyValue].forEach(manager => {
                const option = document.createElement('option');
                option.value = manager.value;
                option.textContent = manager.text;
                managerSelect.appendChild(option);
            });
        }
    }

    // Настройка валидации телефона
    setupPhoneValidation() {
        const phoneInput = document.getElementById('clientPhone');
        
        phoneInput.addEventListener('keydown', (e) => {
            // Разрешаем: backspace, delete, tab, escape, enter
            if ([8, 9, 13, 27, 46].includes(e.keyCode) ||
                (e.keyCode >= 37 && e.keyCode <= 40)) { // стрелки
                return;
            }
            
            // Запрещаем нецифровые символы
            if (e.keyCode < 48 || e.keyCode > 57) {
                e.preventDefault();
            }
        });
        
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, ''); // Удаляем все нецифровые символы
            
            // Ограничиваем длину до 11 цифр (7 + 10 цифр номера)
            if (value.length > 11) {
                value = value.slice(0, 11);
            }
            
            // Форматируем номер
            if (value.length > 0) {
                if (value.startsWith('8')) {
                    value = '7' + value.slice(1); // Заменяем 8 на 7
                }
                
                let formatted = '+7';
                if (value.length > 1) {
                    formatted += '-' + value.slice(1, 4);
                }
                if (value.length > 4) {
                    formatted += '-' + value.slice(4, 7);
                }
                if (value.length > 7) {
                    formatted += '-' + value.slice(7, 9);
                }
                if (value.length > 9) {
                    formatted += '-' + value.slice(9, 11);
                }
                
                e.target.value = formatted;
            }
            
            // Валидация
            this.validatePhone(e.target);
        });
        
        phoneInput.addEventListener('blur', (e) => {
            this.validatePhone(e.target);
        });
    }

    // Валидация номера телефона
    validatePhone(input) {
        const value = input.value;
        const phoneRegex = /^\+7-\d{3}-\d{3}-\d{2}-\d{2}$/;
        
        this.removeValidationMessage(input);
        
        if (value && !phoneRegex.test(value)) {
            this.showValidationError(input, 'Неверный формат номера. Используйте: +7-XXX-XXX-XX-XX');
            input.classList.add('error');
            input.classList.remove('success');
        } else if (value) {
            input.classList.add('success');
            input.classList.remove('error');
        } else {
            input.classList.remove('error', 'success');
        }
    }

    // Настройка валидации дат
    setupDateValidation() {
        const startDateInput = document.getElementById('eventDateStart');
        const endDateInput = document.getElementById('eventDateEnd');
        
        // Валидация при изменении даты начала
        startDateInput.addEventListener('change', () => {
            this.validateDateRange();
        });
        
        // Валидация при изменении даты окончания
        endDateInput.addEventListener('change', () => {
            this.validateDateRange();
        });
    }

    // Валидация диапазона дат
    validateDateRange() {
        const startDateInput = document.getElementById('eventDateStart');
        const endDateInput = document.getElementById('eventDateEnd');
        
        this.removeValidationMessage(startDateInput);
        this.removeValidationMessage(endDateInput);
        
        if (startDateInput.value && endDateInput.value) {
            const startDate = new Date(startDateInput.value);
            const endDate = new Date(endDateInput.value);
            
            if (endDate < startDate) {
                this.showValidationError(endDateInput, 'Дата окончания не может быть раньше даты начала');
                endDateInput.classList.add('error');
                startDateInput.classList.remove('error', 'success');
                return false;
            } else {
                startDateInput.classList.add('success');
                endDateInput.classList.add('success');
                startDateInput.classList.remove('error');
                endDateInput.classList.remove('error');
            }
        } else if (startDateInput.value) {
            startDateInput.classList.add('success');
            startDateInput.classList.remove('error');
        }
        
        return true;
    }

    // Настройка загрузки файлов
    setupFileUpload() {
        const uploadArea = document.getElementById('fileUploadArea');
        const fileInput = document.getElementById('decorImages');
        const uploadLink = uploadArea.querySelector('.upload-link');

        // Клик по ссылке для выбора файлов
        uploadLink.addEventListener('click', () => {
            fileInput.click();
        });

        // Клик по области загрузки
        uploadArea.addEventListener('click', (e) => {
            if (e.target === uploadArea || e.target.closest('.upload-placeholder')) {
                fileInput.click();
            }
        });

        // Обработка выбора файлов
        fileInput.addEventListener('change', (e) => {
            this.handleFiles(e.target.files);
        });

        // Drag & Drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            this.handleFiles(e.dataTransfer.files);
        });
    }

    // Обработка загруженных файлов
    handleFiles(files) {
        const maxSize = 10 * 1024 * 1024; // 10MB
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

        Array.from(files).forEach(file => {
            // Проверка типа файла
            if (!allowedTypes.includes(file.type)) {
                alert(`Файл ${file.name} имеет неподдерживаемый формат. Разрешены только JPG, PNG, GIF.`);
                return;
            }

            // Проверка размера файла
            if (file.size > maxSize) {
                alert(`Файл ${file.name} слишком большой. Максимальный размер: 10MB.`);
                return;
            }

            // Проверка на дубликаты
            if (this.uploadedFiles.some(f => f.name === file.name && f.size === file.size)) {
                alert(`Файл ${file.name} уже добавлен.`);
                return;
            }

            this.uploadedFiles.push(file);
            this.displayUploadedFile(file);
        });

        this.updateUploadArea();
    }

    // Отображение загруженного файла
    displayUploadedFile(file) {
        const uploadedFilesContainer = document.getElementById('uploadedFiles');
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';

        const reader = new FileReader();
        reader.onload = (e) => {
            fileItem.innerHTML = `
                <div class="file-info">
                    <img src="${e.target.result}" alt="${file.name}" class="file-preview">
                    <div>
                        <div class="file-name">${file.name}</div>
                        <div class="file-size">${this.formatFileSize(file.size)}</div>
                    </div>
                </div>
                <button type="button" class="remove-file" onclick="formManager.removeFile('${file.name}', this)">×</button>
            `;
        };
        reader.readAsDataURL(file);

        uploadedFilesContainer.appendChild(fileItem);
    }

    // Удаление файла
    removeFile(fileName, button) {
        this.uploadedFiles = this.uploadedFiles.filter(file => file.name !== fileName);
        button.closest('.file-item').remove();
        this.updateUploadArea();
    }

    // Обновление области загрузки
    updateUploadArea() {
        const uploadArea = document.getElementById('fileUploadArea');
        const placeholder = uploadArea.querySelector('.upload-placeholder');
        
        if (this.uploadedFiles.length > 0) {
            placeholder.style.display = 'none';
        } else {
            placeholder.style.display = 'block';
        }
    }

    // Форматирование размера файла
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Управление условными секциями
    setupConditionalSections() {
        this.toggleConditionalSections();
    }

    toggleConditionalSections() {
        const masterClassCheckbox = document.getElementById('masterClasses');
        const decorCheckbox = document.getElementById('decor');
        const masterClassSection = document.getElementById('masterClassSection');
        const decorSection = document.getElementById('decorSection');

        // Показ/скрытие секции мастер-классов
        if (masterClassCheckbox.checked) {
            masterClassSection.style.display = 'block';
            masterClassSection.classList.add('fade-in');
            this.setRequiredFields(masterClassSection, true);
        } else {
            masterClassSection.style.display = 'none';
            this.setRequiredFields(masterClassSection, false);
            this.clearSectionData(masterClassSection);
        }

        // Показ/скрытие секции декора
        if (decorCheckbox.checked) {
            decorSection.style.display = 'block';
            decorSection.classList.add('fade-in');
        } else {
            decorSection.style.display = 'none';
            this.clearSectionData(decorSection);
            this.uploadedFiles = [];
            this.updateUploadArea();
        }
    }

    // Установка обязательных полей
    setRequiredFields(section, required) {
        // Для секции мастер-классов поля участники, длительность и мастера теперь необязательные
        // Поэтому не устанавливаем required для input[type="number"]
        // Оставляем только обязательные поля, которые уже помечены в HTML
    }

    // Очистка данных секции
    clearSectionData(section) {
        const inputs = section.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            if (input.type === 'number') {
                input.value = '';
            } else {
                input.value = '';
            }
            input.classList.remove('error', 'success');
        });
    }

    // Валидация формы
    validateForm() {
        let isValid = true;
        const errors = [];

        // Проверка обязательных полей
        const requiredFields = this.form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            this.removeValidationMessage(field);
            
            if (!field.value.trim()) {
                this.showValidationError(field, 'Это поле обязательно для заполнения');
                field.classList.add('error');
                isValid = false;
            } else {
                field.classList.remove('error');
            }
        });

        // Проверка телефона
        const phoneInput = document.getElementById('clientPhone');
        if (phoneInput.value) {
            const phoneRegex = /^\+7-\d{3}-\d{3}-\d{2}-\d{2}$/;
            if (!phoneRegex.test(phoneInput.value)) {
                this.showValidationError(phoneInput, 'Неверный формат номера телефона');
                phoneInput.classList.add('error');
                isValid = false;
            }
        }

        // Проверка диапазона дат
        if (!this.validateDateRange()) {
            isValid = false;
        }

        // Проверка выбора направлений
        const directionCheckboxes = document.querySelectorAll('input[name="directions"]:checked');
        if (directionCheckboxes.length === 0) {
            errors.push('Выберите хотя бы одно продуктовое направление');
            isValid = false;
        }

        // Проверка полей мастер-классов
        const masterClassCheckbox = document.getElementById('masterClasses');
        if (masterClassCheckbox.checked) {
            const participants = document.getElementById('participants');
            const duration = document.getElementById('duration');
            const masters = document.getElementById('masters');

            if (participants.value && parseInt(participants.value) < 1) {
                this.showValidationError(participants, 'Количество участников должно быть больше 0');
                participants.classList.add('error');
                isValid = false;
            }

            if (duration.value && parseFloat(duration.value) < 0.5) {
                this.showValidationError(duration, 'Длительность должна быть не менее 0.5 часа');
                duration.classList.add('error');
                isValid = false;
            }

            if (masters.value && parseInt(masters.value) < 1) {
                this.showValidationError(masters, 'Количество мастеров должно быть больше 0');
                masters.classList.add('error');
                isValid = false;
            }
        }

        // Показ общих ошибок
        if (errors.length > 0) {
            alert('Ошибки валидации:\n' + errors.join('\n'));
        }

        return isValid;
    }

    // Показ ошибки валидации
    showValidationError(field, message) {
        this.removeValidationMessage(field);
        
        const errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        
        field.parentNode.appendChild(errorElement);
    }

    // Удаление сообщения валидации
    removeValidationMessage(field) {
        const existingMessage = field.parentNode.querySelector('.error-message, .success-message');
        if (existingMessage) {
            existingMessage.remove();
        }
    }

    // Сбор данных формы
    collectFormData() {
        const formData = new FormData(this.form);
        const data = {};

        // Базовая информация
        data.company = formData.get('company');
        data.manager = formData.get('manager');
        data.eventDateStart = formData.get('eventDateStart');
        data.eventDateEnd = formData.get('eventDateEnd');
        data.eventComment = formData.get('eventComment');
        data.clientName = formData.get('clientName');
        data.clientPhone = formData.get('clientPhone');

        // Выбранные направления
        const selectedDirections = formData.getAll('directions');
        data.selectedDirections = {
            masterClasses: selectedDirections.includes('masterClasses'),
            decor: selectedDirections.includes('decor')
        };

        // Данные мастер-классов
        if (data.selectedDirections.masterClasses) {
            const requests = formData.get('masterClassRequests');
            data.masterClassData = {
                requests: requests ? [requests.trim()].filter(r => r) : [],
                participants: parseInt(formData.get('participants')) || 0,
                duration: parseFloat(formData.get('duration')) || 0,
                masters: parseInt(formData.get('masters')) || 0,
                comment: formData.get('masterClassComment') || ''
            };
        }

        // Данные декора
        if (data.selectedDirections.decor) {
            data.decorData = {
                comment: formData.get('decorComment') || '',
                images: this.uploadedFiles.map(file => ({
                    name: file.name,
                    size: file.size,
                    type: file.type
                }))
            };
        }

        return data;
    }

    // Обработка отправки формы
    async handleSubmit(e) {
        e.preventDefault();

        if (!this.validateForm()) {
            return;
        }

        const submitBtn = document.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        
        submitBtn.disabled = true;
        submitBtn.textContent = 'Отправка...';

        try {
            // Создаем FormData для отправки файлов и данных
            const formData = new FormData();
            
            // Собираем данные формы
            const data = this.collectFormData();
            
            // Добавляем основные данные как JSON строку
            formData.append('data', JSON.stringify({
                company: data.company,
                manager: data.manager,
                eventDateStart: data.eventDateStart,
                eventDateEnd: data.eventDateEnd,
                eventComment: data.eventComment,
                clientName: data.clientName,
                clientPhone: data.clientPhone,
                selectedDirections: data.selectedDirections,
                masterClassData: data.masterClassData,
                decorData: data.decorData ? {
                    comment: data.decorData.comment,
                    imagesCount: this.uploadedFiles.length
                } : undefined
            }));
            
            // Добавляем файлы изображений
            this.uploadedFiles.forEach((file, index) => {
                formData.append(`image_${index}`, file);
            });
            
            // Отправляем данные на webhook
            const response = await fetch('https://dosugmayak.ru/webhook/brief', {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                alert('Данные успешно отправлены!');
                console.log('Данные отправлены на webhook:', data);
                
                // Опционально: очистка формы после успешной отправки
                this.resetForm();
            } else {
                throw new Error(`Ошибка сервера: ${response.status} ${response.statusText}`);
            }
            
        } catch (error) {
            console.error('Ошибка при отправке данных:', error);
            alert(`Ошибка при отправке данных: ${error.message}\nПопробуйте еще раз или обратитесь к администратору.`);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }

    // Сброс формы
    resetForm() {
        this.form.reset();
        this.uploadedFiles = [];
        this.updateUploadArea();
        this.toggleConditionalSections();
        
        // Удаление всех сообщений валидации
        const validationMessages = this.form.querySelectorAll('.error-message, .success-message');
        validationMessages.forEach(msg => msg.remove());
        
        // Удаление классов валидации
        const fields = this.form.querySelectorAll('.error, .success');
        fields.forEach(field => field.classList.remove('error', 'success'));
    }
}

// Инициализация формы при загрузке страницы
let formManager;
document.addEventListener('DOMContentLoaded', () => {
    formManager = new FormManager();
});