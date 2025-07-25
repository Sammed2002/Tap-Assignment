
let map;

function initMap(position) {
  const { latitude, longitude } = position.coords;
  const userLocation = { lat: latitude, lng: longitude };

  document.getElementById('locationStatus').textContent =
    `You're at: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;

  map = new google.maps.Map(document.getElementById("map"), {
    center: userLocation,
    zoom: 15,
  });

  new google.maps.Marker({
    position: userLocation,
    map,
    title: "You are here",
  });


  const toilets = [
    { lat: latitude + 0.0015, lng: longitude + 0.001, name: "Public Toilet - City Mall" },
    { lat: latitude - 0.001, lng: longitude - 0.0015, name: "Public Toilet - Metro Station" },
  ];

  toilets.forEach(loc => {
    new google.maps.Marker({
      position: { lat: loc.lat, lng: loc.lng },
      map,
      title: loc.name,
      icon: "https://maps.google.com/mapfiles/ms/icons/toilets.png"
    });
  });
}

function locateUser() {
  const locStatus = document.getElementById('locationStatus');
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      initMap,
      () => locStatus.textContent = "Unable to fetch your location."
    );
  } else {
    locStatus.textContent = "Geolocation is not supported.";
  }
}


function checkNetwork() {
  const netText = document.getElementById('networkStatus');
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

  if (conn) {
    function updateStatus() {
      netText.textContent = `Network: ${conn.effectiveType.toUpperCase()}`;
      if (conn.downlink < 1) {
        netText.style.color = "red";
        netText.textContent += " – Might load slowly.";
      } else {
        netText.style.color = "green";
      }
    }
    updateStatus();
    conn.addEventListener("change", updateStatus);
  } else {
    netText.textContent = "Network info not supported.";
  }
}

const tips = document.querySelectorAll('.tip');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

tips.forEach(tip => observer.observe(tip));

window.addEventListener('load', () => {
  locateUser();
  checkNetwork();
});
