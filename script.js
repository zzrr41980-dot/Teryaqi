let medicines = JSON.parse(localStorage.getItem('myMedicines')) || [];
// هذا السطر يطلب من المتصفح جلب الأدوية المحفوظة سابقاً
//تحديث الاحصائيات العلوية
function updateStats() {
    document.getElementById('total-medicines').textContent = medicines.length;
    document.getElementById('taken-count').textContent = medicines.filter(m => m.status === 'taken').length;
    document.getElementById('pending-count').textContent = medicines.filter(m => m.status === 'pending').length;
    document.getElementById('missed-count').textContent = medicines.filter(m => m.status === 'missed').length;
}

// التعامل مع الفورم
document.getElementById('medicine-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const medName = document.getElementById('medicine-name').value;
    const datalist = document.getElementById('medicine-options');

    // إضافة الدواء الجديد لقائمة الاختيارات تلقائياً
    const currentOptions = Array.from(datalist.options).map(opt => opt.value);
    if (!currentOptions.includes(medName)) {
        const newOption = document.createElement('option');
        newOption.value = medName;
        datalist.appendChild(newOption);
    }
    const newMed = {
        patient_name: document.getElementById('patient-name').value,
        medicine_name: medName,
        dosage: document.getElementById('dosage').value,
        time: document.getElementById('medicine-time').value,
        status: 'pending'
    };

    medicines.push(newMed);

    // سطر الحفظ مكانه الصحيح هنا بعد إضافة الدواء للقائمة
    localStorage.setItem('myMedicines', JSON.stringify(medicines));

    renderMedicines();
    updateStats();
    this.reset();
});

// رسم قائمة الأدوية في الجدول
function renderMedicines() {
    const container = document.getElementById('medicines-list');
    const emptyState = document.getElementById('empty-state');

    if (medicines.length === 0) {
        emptyState.classList.remove('hidden');
        container.innerHTML = '';
        return;
    }

    emptyState.classList.add('hidden');
    container.innerHTML = '';

    medicines.forEach((med) => {
        const defaultImg = 'https://cdn-icons-png.flaticon.com/512/883/883360.png';
        const medImg = medicineImages[med.medicine_name] || defaultImg;

        const div = document.createElement('div');
        div.className = 'p-4 mb-3 rounded-2xl bg-white shadow-sm flex justify-between items-center border border-gray-100 hover:shadow-md transition-all';
        div.innerHTML = `
      <div class="flex items-center gap-3">
        <img src="${medImg}" class="w-12 h-12 rounded-lg bg-emerald-50 p-2">
        <div>
          <h3 class="font-bold text-gray-800">${med.medicine_name}</h3>
          <p class="text-sm text-gray-500">${med.patient_name} - ${med.dosage}</p>
        </div>
      </div>
      <div class="text-left">
        <span class="block font-bold text-emerald-600">${med.time}</span>
        <span class="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-600">في الانتظار</span>
      </div>
    `;
        container.appendChild(div);
    });
} // تعديل دالة الإضافة لتشمل الخانات الجديدة
document.getElementById('medicine-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const newMed = {
        id: Date.now(),
        patient_name: document.getElementById('patient-name').value,
        medicine_name: document.getElementById('medicine-name').value,
        dosage: document.getElementById('dosage').value,
        time: document.getElementById('medicine-time').value,
        disease: document.getElementById('disease-type').value, // إضافة الحالة
        notes: document.getElementById('personal-notes').value, // إضافة الملاحظات
        status: 'pending'
    };

    medicines.unshift(newMed);
    localStorage.setItem('myMedicines', JSON.stringify(medicines));
    renderMedicines();
    updateStats();
    this.reset();
});

// تعديل العرض ليظهر كل شيء في الكرت تحت
function renderMedicines() {
    const container = document.getElementById('medicines-list');
    container.innerHTML = medicines.map(med => `
        <div class="p-4 mb-3 rounded-2xl bg-white shadow-sm border-r-8 border-emerald-500 flex flex-col gap-2">
            <div class="flex justify-between items-start">
                <div>
                    <h3 class="font-bold text-gray-800">${med.medicine_name}</h3>
                    <p class="text-[10px] text-gray-500">${med.patient_name} - ${med.dosage}</p>
                </div>
                <div class="text-left font-bold text-emerald-600 text-sm">${med.time}</div>
            </div>
            <span class="text-[9px] w-fit px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-bold">${med.disease}</span>
            <div class="bg-gray-50 p-2 rounded-lg border-t mt-1">
                <p class="text-[10px] text-emerald-800 leading-relaxed font-bold italic">📝 ملاحظات: ${med.notes || 'لا توجد'}</p>
            </div>
        </div>
    `).join('');
}