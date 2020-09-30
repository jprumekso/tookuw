import { pageData } from '../tookuw-store.js';
import { Catalog } from '../components/Catalog.js';

// Initial state of all data on the page
pageData.catalogItems = [
  {
    id: 11,
    title: 'Ripe Banana',
    stock: 150,
    price: 12500
  },
  {
    id: 12,
    title: 'Fresh Apple',
    stock: 75,
    price: 6500
  },
  {
    id: 13,
    title: 'Juicy Orange',
    stock: 100,
    price: 7500
  },
  {
    id: 14,
    title: 'Giant Mango',
    stock: 5,
    price: 25000
  },
  {
    id: 15,
    title: 'Seedless Guava',
    stock: 15,
    price: 45000
  },
  {
    id: 16,
    title: 'Creamy Durian',
    stock: 77,
    price: 12000
  },
  {
    id: 17,
    title: 'Sweety Grape',
    stock: 35,
    price: 22000
  },
  {
    id: 18,
    title: 'Tasty Pear',
    stock: 0,
    price: 5000
  },
];
pageData.filteredCatalog = [];
pageData.catalogSearchQuery = '';

const CatalogComponent = new Catalog();

// Catalog Search Bar -- When user types the search query to filter catalog
document.querySelector('#search-catalog').addEventListener('keyup', function (e) {

  // Grab the search input value and turn to lowercase
  pageData.catalogSearchQuery = this.value.toLowerCase();

  // Filter the catalogItem data
  CatalogComponent.filter();

  // Render Catalog
  CatalogComponent.render();

});

CatalogComponent.render();