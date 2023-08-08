// script.js

// Создаем переменные для кнопки и контейнера карты
const openMapButton = document.getElementById('openMap');
const mapContainer = document.getElementById('mapContainer');

// Функция инициализации карты
function initMap() {
  const map = new ymaps.Map('mapContainer', {
    center: [55.755814, 37.617635], // Координаты Москвы (по умолчанию)
    zoom: 10, // Масштаб карты
  });

  // Добавляем обработчик клика по карте
  map.events.add('click', async (e) => {
    const point = e.get('coords'); // Коодинаты клика

    const adresData = await getAddressAndLocality(point[0], point[1]);

    const balloonContent = `
<div class = "balloon">
<p> Координаты : ${point} </p>
<p> Регион: ${adresData.address}</p>
<p> Ближайший населенный пункт:${adresData.locality} </p>
</div>
`;

    // Создаем балун с информацией
    if (balloonContent) {
      let placemark = new ymaps.Placemark(point, {
        balloonContentHeader: balloonContent,
      });

      map.geoObjects.add(placemark);
    }
  });
}

// Добавляем обработчик события для кнопки "Open Map"
openMapButton.addEventListener('click', () => {
  // Очищаем контейнер перед отображением карты
  mapContainer.innerHTML = '';

  // Ожидаем инициализации API и создаем карту
  ymaps.ready(() => {
    initMap();
  });
});

async function getAddressAndLocality(lat, lon) {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data && data.address) {
      const address = data.display_name;
      const locality = data.address.city || data.address.town || data.address.village;

      return { address, locality };
    } else {
      return { error: 'Address not found' };
    }
  } catch (error) {
    return { error: 'Error fetching data' };
  }
}
