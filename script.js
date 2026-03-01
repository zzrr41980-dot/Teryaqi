// ==========================
// Triyaqi - Frontend Script
// ==========================

// جلب user_id من تسجيل الدخول
const user_id = localStorage.getItem("user_id");

if (!user_id) {
    alert("يجب تسجيل الدخول أولاً");
    window.location.href = "login.html";
}

// --------------------------
// دالة إضافة دواء جديد عبر API
// --------------------------
document.getElementById('medicine-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const patientName = document.getElementById('patient-name').value;
    const medicineName = document.getElementById('medicine-name').value;
    const dosage = document.getElementById('dosage').value;
    const time = document.getElementById('medicine-time').value;

    fetch("http://localhost/triyaqi-api/index.php/medications", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            user_id: user_id,
            patient_name: patientName,
            medicine_name: medicineName,
            dosage: dosage,
            time: time
        })
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        loadMedicines();
        this.reset();
    })
    .catch(err => {
        console.error("Error adding medicine:", err);
        alert("حدث خطأ أثناء إضافة الدواء");
    });
});

// --------------------------
// دالة جلب كل الأدوية من API وعرضها
// --------------------------
function loadMedicines() {
    fetch(`http://localhost/triyaqi-api/index.php/medications?user_id=${user_id}`)
    .then(res => res.json())
    .then(data => {
        const container = document.getElementById('medicines-list');
        const emptyState = document.getElementById('empty-state');

        container.innerHTML = "";

        if (data.length === 0) {
            emptyState.classList.remove('hidden');
            document.getElementById('total-medicines').textContent = 0;
            document.getElementById('taken-count').textContent = 0;
            document.getElementById('pending-count').textContent = 0;
            document.getElementById('missed-count').textContent = 0;
            return;
        }

        emptyState.classList.add('hidden');

        document.getElementById('total-medicines').textContent = data.length;

        let taken = 0;
        let pending = 0;
        let missed = 0;

        data.forEach((med) => {

            if (med.status === 'taken') taken++;
            else if (med.status === 'missed') missed++;
            else pending++;

            const div = document.createElement('div');
            div.className = 'p-4 mb-3 rounded-2xl bg-white shadow-sm flex justify-between items-center border border-gray-100 hover:shadow-md transition-all';

            div.innerHTML = `
                <div class="flex items-center gap-3">
                    <img src="https://cdn-icons-png.flaticon.com/512/883/883360.png" class="w-12 h-12 rounded-lg bg-emerald-50 p-2">
                    <div>
                        <h3 class="font-bold text-gray-800">${med.medicine_name}</h3>
                        <p class="text-sm text-gray-500">${med.patient_name} - ${med.dosage}</p>
                    </div>
                </div>
                <div class="text-left">
                    <span class="block font-bold text-emerald-600">${med.time}</span>
                    <span class="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-600">${med.status}</span>
                </div>
            `;

            container.appendChild(div);
        });

        document.getElementById('taken-count').textContent = taken;
        document.getElementById('pending-count').textContent = pending;
        document.getElementById('missed-count').textContent = missed;

    })
    .catch(err => {
        console.error("Error loading medicines:", err);
        alert("حدث خطأ أثناء جلب الأدوية");
    });
}

// --------------------------
// تحميل الأدوية عند فتح الصفحة
// --------------------------
loadMedicines();