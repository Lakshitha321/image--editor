const fileInput = document.querySelector(".file-input");
const previewImg = document.querySelector(".preview-img img");
const filterOptions = document.querySelectorAll(".filter .options button");
const filterName = document.querySelector(".filter-info .name");
const filterValue = document.querySelector(".filter-info .value");
const filterSlider = document.querySelector(".slider input");
const rotateOptions = document.querySelectorAll(".rotate .options button");
const adjustOptions = document.querySelectorAll(".adjust .options button");
const resetFilterBtn = document.querySelector(".reset-filters");
const chooseImgBtn = document.querySelector(".choose-img");
const saveImgBtn = document.querySelector(".save-img");
const themeToggle = document.querySelector(".theme-toggle");

// Initialize variables
let brightness = 100, saturation = 100, inversion = 0, grayscale = 0;
let contrast = 100, blur = 0, sepia = 0, hue = 0;
let rotate = 0, flipHorizontal = 1, flipVertical = 1;
let activeFilter = "brightness";

// Apply filters to image
const applyFilters = () => {
  previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
  previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%) contrast(${contrast}%) blur(${blur}px) sepia(${sepia}%) hue-rotate(${hue}deg)`;
};

// Load image
const loadImage = () => {
  let file = fileInput.files[0];
  if (!file) return;
  
  previewImg.src = URL.createObjectURL(file);
  previewImg.addEventListener("load", () => {
    resetFilterBtn.click(); // Reset filters
    document.querySelector(".container").classList.remove("disable");
  });
};

// Update filter values
const updateFilter = () => {
  filterValue.innerText = `${filterSlider.value}%`;
  
  switch(activeFilter) {
    case "brightness":
      brightness = filterSlider.value;
      break;
    case "saturation":
      saturation = filterSlider.value;
      break;
    case "inversion":
      inversion = filterSlider.value;
      break;
    case "grayscale":
      grayscale = filterSlider.value;
      break;
    case "contrast":
      contrast = filterSlider.value;
      break;
    case "blur":
      blur = filterSlider.value / 10; // Scale down for blur
      filterValue.innerText = `${blur}px`;
      break;
    case "sepia":
      sepia = filterSlider.value;
      break;
    case "hue":
      hue = filterSlider.value * 1.8; // Scale for hue (0-360 degrees)
      filterValue.innerText = `${hue}°`;
      break;
  }
  
  applyFilters();
};

// Handle filter button clicks
filterOptions.forEach(option => {
  option.addEventListener("click", () => {
    document.querySelector(".filter .active").classList.remove("active");
    option.classList.add("active");
    filterName.innerText = option.innerText;
    activeFilter = option.id;
    
    // Update slider based on active filter
    switch(activeFilter) {
      case "brightness":
        filterSlider.max = "200";
        filterSlider.value = brightness;
        filterValue.innerText = `${brightness}%`;
        break;
      case "saturation":
        filterSlider.max = "200";
        filterSlider.value = saturation;
        filterValue.innerText = `${saturation}%`;
        break;
      case "inversion":
        filterSlider.max = "100";
        filterSlider.value = inversion;
        filterValue.innerText = `${inversion}%`;
        break;
      case "grayscale":
        filterSlider.max = "100";
        filterSlider.value = grayscale;
        filterValue.innerText = `${grayscale}%`;
        break;
      case "contrast":
        filterSlider.max = "200";
        filterSlider.value = contrast;
        filterValue.innerText = `${contrast}%`;
        break;
      case "blur":
        filterSlider.max = "100";
        filterSlider.value = blur * 10; // Scale up for slider
        filterValue.innerText = `${blur}px`;
        break;
      case "sepia":
        filterSlider.max = "100";
        filterSlider.value = sepia;
        filterValue.innerText = `${sepia}%`;
        break;
      case "hue":
        filterSlider.max = "200";
        filterSlider.value = hue / 1.8; // Scale down for slider
        filterValue.innerText = `${hue}°`;
        break;
    }
  });
});

// Additional filter options
adjustOptions.forEach(option => {
  option.addEventListener("click", () => {
    document.querySelector(".filter .active").classList.remove("active");
    filterOptions[0].classList.add("active"); // Default to brightness
    filterName.innerText = option.innerText;
    activeFilter = option.id;
    
    // Update slider based on active filter
    switch(activeFilter) {
      case "contrast":
        filterSlider.max = "200";
        filterSlider.value = contrast;
        filterValue.innerText = `${contrast}%`;
        break;
      case "blur":
        filterSlider.max = "100";
        filterSlider.value = blur * 10;
        filterValue.innerText = `${blur}px`;
        break;
      case "sepia":
        filterSlider.max = "100";
        filterSlider.value = sepia;
        filterValue.innerText = `${sepia}%`;
        break;
      case "hue":
        filterSlider.max = "200";
        filterSlider.value = hue / 1.8;
        filterValue.innerText = `${hue}°`;
        break;
    }
  });
});

// Handle rotation & flip options
rotateOptions.forEach(option => {
  option.addEventListener("click", () => {
    switch(option.id) {
      case "left":
        rotate -= 90;
        break;
      case "right":
        rotate += 90;
        break;
      case "horizontal":
        flipHorizontal = flipHorizontal === 1 ? -1 : 1;
        break;
      case "vertical":
        flipVertical = flipVertical === 1 ? -1 : 1;
        break;
    }
    applyFilters();
  });
});

// Reset filters
const resetFilters = () => {
  brightness = 100; saturation = 100; inversion = 0; grayscale = 0;
  contrast = 100; blur = 0; sepia = 0; hue = 0;
  rotate = 0; flipHorizontal = 1; flipVertical = 1;
  
  filterOptions[0].click(); // Select brightness by default
  applyFilters();
};

// Save image
const saveImage = () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = previewImg.naturalWidth;
  canvas.height = previewImg.naturalHeight;
  
  // Apply filters to canvas
  ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%) contrast(${contrast}%) blur(${blur}px) sepia(${sepia}%) hue-rotate(${hue}deg)`;
  
  // Handle rotation and flipping
  ctx.translate(canvas.width / 2, canvas.height / 2);
  if (rotate !== 0) {
    ctx.rotate(rotate * Math.PI / 180);
  }
  ctx.scale(flipHorizontal, flipVertical);
  ctx.drawImage(previewImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
  
  // Create download link
  const link = document.createElement("a");
  link.download = "imgchamp-edited.jpg";
  link.href = canvas.toDataURL("image/jpeg");
  link.click();
};

// Toggle theme
const toggleTheme = () => {
  document.body.classList.toggle("light-theme");
  if (document.body.classList.contains("light-theme")) {
    themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
  } else {
    themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
  }
};

// Event listeners
filterSlider.addEventListener("input", updateFilter);
resetFilterBtn.addEventListener("click", resetFilters);
saveImgBtn.addEventListener("click", saveImage);
fileInput.addEventListener("change", loadImage);
chooseImgBtn.addEventListener("click", () => fileInput.click());
themeToggle.addEventListener("click", toggleTheme);

// Initialize the app
window.addEventListener("load", () => {
  // Set default state
  resetFilters();
});