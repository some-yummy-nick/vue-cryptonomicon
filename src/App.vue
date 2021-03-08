<template>
  <div class="container mx-auto flex flex-col items-center bg-gray-100 p-4">
    <div class="container">
      <Loading v-if="isLoading" />
      <div v-else>
        <div class="w-full my-4"></div>
        <section>
          <div class="flex">
            <div class="max-w-xs">
              <label
                for="wallet"
                class="block text-sm font-medium text-gray-700"
                >Тикер</label
              >
              <div class="mt-1 relative rounded-md shadow-md">
                <input
                  v-model="ticker"
                  @keydown.enter="add"
                  @input="handleInput"
                  type="text"
                  name="wallet"
                  id="wallet"
                  class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
                  placeholder="Например DOGE"
                />
              </div>
              <div
                v-if="suggestsItems.length"
                class="flex bg-white shadow-md p-1 rounded-md shadow-md flex-wrap"
              >
                <button
                  type="button"
                  v-for="item in suggestsItems"
                  :key="item.Id"
                  @click="clickToSuggest(item.Symbol)"
                  class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer"
                >
                  {{ item.Symbol }}
                </button>
              </div>
              <div class="text-sm text-red-600" v-if="hasTicker">
                Такой тикер уже добавлен
              </div>
            </div>
          </div>
          <button
            @click="add"
            type="button"
            class="my-4 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            <svg
              class="-ml-0.5 mr-2 h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="#ffffff"
            >
              <path
                d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
              ></path>
            </svg>
            Добавить
          </button>
        </section>
        <hr class="w-full border-t border-gray-600 my-4" />
        <div>
          <button
            class="my-4 mx-4 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            @click="page = page - 1"
            v-if="page > 1"
          >
            Назад
          </button>
          <button
            class="my-4 mx-4 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            @click="page = page + 1"
            v-if="hasNextPage"
          >
            Вперед
          </button>
          <br />
          Фильтр: <input type="text" v-model="filter" @input="page = 1" />
        </div>
        <div v-if="items">
          <hr class="w-full border-t border-gray-600 my-4" />
          <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div
              v-for="item in paginatedTickers"
              :key="item.name"
              @click="selectedItem = item"
              :class="{ 'border-purple-800': selectedItem === item }"
              class="bg-white overflow-hidden shadow rounded-lg border-4 border-solid cursor-pointer"
            >
              <div class="px-4 py-5 sm:p-6 text-center">
                <dt class="text-sm font-medium text-gray-500 truncate">
                  {{ item.name }} - USD
                </dt>
                <dd class="mt-1 text-3xl font-semibold text-gray-900">
                  {{ formatPrice(item.price) }}
                </dd>
              </div>
              <div class="w-full border-t border-gray-200"></div>
              <button
                @click.stop="handleDelete(item)"
                class="flex items-center justify-center font-medium w-full bg-gray-100 px-4 py-4 sm:px-6 text-md text-gray-500 hover:text-gray-600 hover:bg-gray-200 hover:opacity-20 transition-all focus:outline-none"
              >
                <svg
                  class="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="#718096"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                Удалить
              </button>
            </div>
          </dl>
          <hr class="w-full border-t border-gray-600 my-4" />
        </div>
        <section class="relative" v-if="selectedItem">
          <h3 class="text-lg leading-6 font-medium text-gray-900 my-8">
            {{ selectedItem.name }} - USD
          </h3>
          <div class="flex items-end border-gray-600 border-b border-l h-64">
            <div
              v-for="(bar, i) in normalizedGraph"
              :style="{ height: `${bar}%` }"
              :key="i"
              class="bg-purple-800 border w-10"
            ></div>
          </div>
          <button
            type="button"
            class="absolute top-0 right-0"
            @click="closeGraph"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              xmlns:svgjs="http://svgjs.com/svgjs"
              version="1.1"
              width="30"
              height="30"
              x="0"
              y="0"
              viewBox="0 0 511.76 511.76"
              style="enable-background:new 0 0 512 512"
              xml:space="preserve"
            >
              <g>
                <path
                  d="M436.896,74.869c-99.84-99.819-262.208-99.819-362.048,0c-99.797,99.819-99.797,262.229,0,362.048    c49.92,49.899,115.477,74.837,181.035,74.837s131.093-24.939,181.013-74.837C536.715,337.099,536.715,174.688,436.896,74.869z     M361.461,331.317c8.341,8.341,8.341,21.824,0,30.165c-4.16,4.16-9.621,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251    l-75.413-75.435l-75.392,75.413c-4.181,4.16-9.643,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251    c-8.341-8.341-8.341-21.845,0-30.165l75.392-75.413l-75.413-75.413c-8.341-8.341-8.341-21.845,0-30.165    c8.32-8.341,21.824-8.341,30.165,0l75.413,75.413l75.413-75.413c8.341-8.341,21.824-8.341,30.165,0    c8.341,8.32,8.341,21.824,0,30.165l-75.413,75.413L361.461,331.317z"
                  fill="#718096"
                  data-original="#000000"
                ></path>
              </g>
            </svg>
          </button>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api";
import storage from "./storage";
import Loading from "@/components/Loading";
import { subscribeToTicker, unsubscribeFromTicker } from "./api/socket";

export default {
  name: "App",
  components: { Loading },
  data() {
    return {
      ticker: null,
      items: [],
      selectedItem: null,
      graph: [],
      interval: null,
      coinList: [],
      isLoading: true,
      hasTicker: false,
      suggestsItems: [],
      page: 1,
      pageLength: 10,
      filter: ""
    };
  },
  created() {
    this.getUrl();
    this.getCoinList();
    this.getFromStorage();
  },
  computed: {
    startIndex() {
      return (this.page - 1) * this.pageLength;
    },
    endIndex() {
      return this.page * this.pageLength;
    },
    filteredTickers() {
      if (!this.items) return false;
      return this.items.filter(item =>
        item.name.toLowerCase().includes(this.filter.toLowerCase())
      );
    },
    paginatedTickers() {
      if (!this.filteredTickers) return false;
      return this.filteredTickers.slice(this.startIndex, this.endIndex);
    },
    hasNextPage() {
      return this.filteredTickers.length > this.endIndex;
    },
    normalizedGraph() {
      const maxValue = Math.max(...this.graph);
      const minValue = Math.min(...this.graph);
      if (minValue === maxValue) {
        return this.graph.map(() => 50);
      }
      return this.graph.map(
        price => 5 + ((price - minValue) * 95) / (maxValue - minValue)
      );
    },
    pageStateOptions() {
      return {
        filter: this.filter,
        page: this.page
      };
    }
  },
  watch: {
    pageStateOptions(value) {
      window.history.pushState(
        null,
        document.title,
        `${window.location.pathname}?filter=${value.filter}&page=${value.page}`
      );
    },
    filter() {
      this.page = 1;
    },
    paginatedTickers(value) {
      if (value.length === 0 && this.page > 1) {
        this.page -= 1;
      }
    },
    selectedItem() {
      this.graph = [];
    }
  },
  methods: {
    async updateTickers() {
      if (!this.items) return false;
      this.items.forEach(item => {
        subscribeToTicker(item.name, newPrice =>
          this.updateTicker(item.name, newPrice)
        );
        if (item === this.selectedItem) {
          this.graph.push(item.price);
        }
      });
    },
    async getCoinList() {
      const res = await api.coinList.index();
      this.isLoading = false;
      this.coinList = res.data.Data;
    },
    async getFromStorage() {
      this.items = (await storage.getItem("tickers")) || [];
      this.updateTickers();
    },
    async add() {
      if (!this.items || !this.items.find(item => item.name === this.ticker)) {
        const currentTicker = {
          name: this.ticker,
          price: null
        };
        this.items = [...this.items, currentTicker];
        this.filter = "";
        subscribeToTicker(currentTicker.name, newPrice =>
          this.updateTicker(currentTicker.name, newPrice)
        );
        const itemsFromStorage = await storage.getItem("tickers");
        let items = [];
        if (itemsFromStorage) {
          if (items.length) {
            items = items.concat(itemsFromStorage);
          } else {
            items = itemsFromStorage;
          }
        }
        items.push(currentTicker);
        storage.setItem("tickers", items);
        this.ticker = null;
        this.suggestsItems = [];
        this.hasTicker = false;
      } else {
        this.hasTicker = true;
      }
    },
    async handleDelete(deletedItem) {
      this.items = this.items.filter(item => item.name !== deletedItem.name);

      const items = await storage.getItem("tickers");
      if (this.selectedItem && this.selectedItem.name === deletedItem.name) {
        this.selectedItem = null;
      }

      const findedItemIndex = items.findIndex(
        item => item.id === deletedItem.id
      );
      items.splice(findedItemIndex, 1);
      unsubscribeFromTicker(deletedItem.name);

      await storage.setItem("tickers", items);
    },
    updateTicker(tickerName, price) {
      this.items
        .filter(t => t.name === tickerName)
        .forEach(t => {
          if (t === this.selectedItem) {
            this.graph.push(price);
          }
          t.price = price;
        });
    },

    formatPrice(price) {
      if (price) {
        return price > 1 ? price.toFixed(2) : price.toPrecision(2);
      }
    },
    getUrl() {
      let params = new URL(document.location).searchParams;
      const filter = params.get("filter");
      const page = Number(params.get("page"));
      if (filter) {
        this.filter = filter;
      }
      if (page) {
        this.page = page;
      }
    },
    handleInput() {
      this.hasTicker = false;
      let suggestsItems = [];
      if (this.ticker) {
        const value = this.ticker.toLowerCase();
        for (let item in this.coinList) {
          const symbolValue = this.coinList[item]["Symbol"].toLowerCase();
          const fullNameValue = this.coinList[item]["FullName"].toLowerCase();
          if (symbolValue.includes(value) || fullNameValue.includes(value)) {
            const coin = {
              Id: this.coinList[item]["Id"],
              Symbol: this.coinList[item]["Symbol"]
            };
            suggestsItems.push(coin);
          }
        }
        if (suggestsItems.length) {
          suggestsItems.sort((a, b) => a["Id"] - b["Id"]);
          if (suggestsItems.length >= 4) {
            suggestsItems.length = 4;
          }
          this.suggestsItems = suggestsItems;
        } else {
          this.suggestsItems = [];
        }
      } else {
        this.suggestsItems = [];
      }
    },
    clickToSuggest(name) {
      this.ticker = name;
      this.add();
    },
    closeGraph() {
      this.selectedItem = null;
      this.graph = [];
    }
  }
};
</script>

<style></style>
