(function seedFakeAffiliates(n = 10) {
  function rndInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function rndName() {
    const nombres = ["María", "Juan", "Lucía", "Carlos", "Sofía", "Mateo", "Valentina", "Martín", "Camila", "Federico"];
    const apellidos = ["González","Pérez","Rodríguez","Gómez","Fernández","López","Sánchez","Martínez","Romero","Vega"];
    return `${nombres[rndInt(0,nombres.length-1)]} ${apellidos[rndInt(0,apellidos.length-1)]}`;
  }

  function rndDNI() {
    // genera DNI argentino plausible de 7-8 dígitos
    return String(rndInt(1000000, 45000000));
  }

  function rndEmail(name, idx) {
    const base = name.toLowerCase().replace(/\s+/g, '.').replace(/[^a-z.]/g,'');
    return `${base}${idx}@example.com`;
  }

  function rndPhone() {
    // formato simple +54 9 XX XXXX-XXXX
    const area = rndInt(11, 299);
    const part1 = rndInt(1000, 9999);
    const part2 = rndInt(1000, 9999);
    return `+54 9 ${area} ${part1}-${part2}`;
  }

  function rndUsername(name, idx) {
    const base = name.split(' ')[0].toLowerCase();
    return `${base}${idx}${rndInt(1,99)}`;
  }

  function rndPassword() {
    // password simple para testing (no usar en producción)
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let pass = "";
    for (let i=0;i<10;i++) pass += chars.charAt(Math.floor(Math.random()*chars.length));
    return pass;
  }

  const planes = ["Esencial","Plus","Premium"];
  const existing = JSON.parse(localStorage.getItem('sociosVidaMedList') || '[]');

  for (let i=0;i<n;i++){
    const name = rndName();
    const user = {
      id: `socio_${Date.now()}_${i}`,
      nombre: name,
      dni: rndDNI(),
      email: rndEmail(name, i),
      telefono: rndPhone(),
      usuario: rndUsername(name, i),
      password: rndPassword(),
      plan: planes[rndInt(0, planes.length-1)],
      creado: new Date().toISOString()
    };
    existing.push(user);
  }

  localStorage.setItem('sociosVidaMedList', JSON.stringify(existing, null, 2));
  console.log(`Seed: ${n} usuarios creados. Total en localStorage: ${existing.length}`);
})(10); // <-- cambia 10 por la cantidad que quieras