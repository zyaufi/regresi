document.addEventListener('DOMContentLoaded', function(){
    function formatAngka(num, decimals) {
            if (typeof num !== 'number' || isNaN(num)) return '-';
            if (decimals < 0) decimals = 0;
            
            const factor = Math.pow(10, decimals);
            const rounded = Math.round(num * factor) / factor;
            
            return rounded.toLocaleString('de-DE', {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals,
                useGrouping: false
            });
        }

        function hitungRegresi() {
            const x = document.getElementById('dataX').value.split(',').map(Number);
            const y = document.getElementById('dataY').value.split(',').map(Number);
            const decimalInput = parseInt(document.getElementById('decimalDigits').value) || 4;
            const decimals = Math.min(Math.max(decimalInput, 0), 10);

            if (x.length !== y.length || x.length === 0) {
                alert("Jumlah data X dan Y harus sama dan tidak kosong!");
                return;
            }
            if (x.some(isNaN) || y.some(isNaN)) {
                alert("Data harus berupa angka!");
                return;
            }

            const n = x.length;
            const sumX = x.reduce((a, b) => a + b, 0);
            const sumY = y.reduce((a, b) => a + b, 0);
            const meanX = sumX / n;
            const meanY = sumY / n;
            const sumXY = x.map((xi, i) => xi * y[i]).reduce((a, b) => a + b, 0);
            const sumX2 = x.map(xi => xi ** 2).reduce((a, b) => a + b, 0);
            const sumY2 = y.map(yi => yi ** 2).reduce((a, b) => a + b, 0);
            let arahKorelasi;

            // Update Tabel
            const tableBody = document.getElementById('tableBody');
            tableBody.innerHTML = '';
            x.forEach((xi, i) => {
                const yi = y[i];
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${i+1}</td>
                    <td>${formatAngka(xi, decimals)}</td>
                    <td>${formatAngka(yi, decimals)}</td>
                    <td>${formatAngka(xi*yi, decimals)}</td>
                    <td>${formatAngka(xi**2, decimals)}</td>
                    <td>${formatAngka(yi**2, decimals)}</td>
                `;
                tableBody.appendChild(tr);
            });

            // Update Total
            document.getElementById('sumX').textContent = formatAngka(sumX, decimals);
            document.getElementById('sumY').textContent = formatAngka(sumY, decimals);
            document.getElementById('sumXY').textContent = formatAngka(sumXY, decimals);
            document.getElementById('sumX2').textContent = formatAngka(sumX2, decimals);
            document.getElementById('sumY2').textContent = formatAngka(sumY2, decimals);

            // Hitung Komponen
            const SSxy = sumXY - (n * meanX * meanY);
            const SSxx = sumX2 - (n * meanX ** 2);
            const SSyy = sumY2 - (n * meanY ** 2);
            
            let r, rSquared, regressionEquation, a, b, tingkatKorelasi, tingkatDeterminasi;
            if (SSxx === 0 || SSyy === 0) {
                [r, rSquared, regressionEquation, tingkatKorelasi, tingkatDeterminasi, a, b, arahKorelasi] = 
                    Array(7).fill('Tidak dapat dihitung');
            } else {
                b = SSxy / SSxx;
                a = meanY - b * meanX;
                r = SSxy / Math.sqrt(SSxx * SSyy);
                rSquared = (SSxy ** 2) / (SSxx * SSyy);
                
                regressionEquation = `y = ${formatAngka(a, decimals)} + ${formatAngka(b, decimals)}x`;
                
                // Analisis Korelasi
                const absR = Math.abs(r);
                tingkatKorelasi = 
                    absR === 0 ? "Tidak ada korelasi" :
                    absR === 1 ? "Sempurna" :
                    absR > 0.7 ? "Kuat" :
                    absR > 0.3 ? "Sedang" : "Lemah";

                // Analisis Determinasi
                const absR2 = Math.abs(rSquared);
                tingkatDeterminasi = 
                    absR2 === 0 ? "Tidak ada" :
                    absR2 === 1 ? "Sempurna" :
                    absR2 > 0.9 ? "Sangat Kuat" :
                    absR2 > 0.75 ? "Kuat" :
                    absR2 > 0.5 ? "Sedang" :
                    absR2 > 0.25 ? "Lemah" : "Sangat Lemah";

                arahKorelasi = b >= 0 ? "Positif" : "Negatif";

            }

            // Tampilkan Hasil
            document.getElementById('results').classList.remove('d-none');
            const updateField = (id, value) => 
                document.getElementById(id).textContent = typeof value === 'number' ? 
                formatAngka(value, decimals) : value;

            updateField('nData', n);
            updateField('meanX', meanX);
            updateField('meanY', meanY);
            updateField('SSxy', SSxy);
            updateField('SSxx', SSxx);
            updateField('SSyy', SSyy);
            updateField('rValue', r);
            updateField('rSquared', rSquared);
            updateField('koefisienB', b);
            updateField('konstantaA', a);
            document.getElementById('arahKorelasi').textContent = arahKorelasi;
            document.getElementById('regressionEquation').textContent = regressionEquation;
            document.getElementById('tingkatKorelasi').textContent = tingkatKorelasi;
            document.getElementById('tingkatDeterminasi').textContent = tingkatDeterminasi;
            document.getElementById('rSquaredPercent').textContent = typeof rSquared === 'number' ? 
                `${formatAngka(rSquared * 100, decimals)}%` : '-';
        }
        document.querySelector('button').addEventListener('click', hitungRegresi);
});
