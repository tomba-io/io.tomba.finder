<template>
  <div>
    <v-card v-if="domains.length > 0" max-width="600" class="mx-auto">
      <v-list subheader two-line>
        <v-list-item v-for="(data, key) in paginatedData" :key="key">
          <v-list-item-avatar>
            <v-avatar>
              <img
                :src="`https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${data.data.organization.website_url}&size=16`"
                alt=""
              />
              <!-- <span class="white--text text-h5">
                {{ data.data.organization.website_url.charAt(0).toUpperCase() }}
              </span> -->
            </v-avatar>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title
              v-text="data.data.organization.website_url"
            ></v-list-item-title>
          </v-list-item-content>

          <v-list-item-action>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon>
                  <v-icon
                    v-bind="attrs"
                    color="grey lighten-1"
                    v-on="on"
                    @click="onClick(data.data.organization.website_url)"
                  >
                    mdi-check-circle
                  </v-icon>
                </v-btn>
              </template>
              <span class="py-6"> Total {{ data.meta.total }} Email </span>
            </v-tooltip>
          </v-list-item-action>
        </v-list-item>
      </v-list>
      <v-pagination v-model="page" :length="pages"></v-pagination>
    </v-card>
    <v-card v-else max-width="600" class="mx-auto">
      <!-- <v-img :src="image"></v-img> -->
      <v-card-title>No Result, yet.</v-card-title>
      <v-card-text>
        Use the Email Finder to find email addresses behind any website.
      </v-card-text>
      <v-card-actions>
        <v-btn @click="onClick">New Finder</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'History',
  data: () => ({
    image: 'https://app.tomba.io/assets/img/empty.png',
    page: 1,
    itemsPerPage: 10,
  }),
  computed: {
    domains() {
      return this.$store.getters.domains
    },
    pages() {
      return Math.ceil(this.domains.length / this.itemsPerPage)
    },
    paginatedData() {
      const start = (this.page - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.domains.slice(start, end)
    },
  },
  mounted() {
    this.loadState()
  },
  methods: {
    loadState() {
      if (localStorage.getItem('domains')) {
        this.$store.commit('loadJSON', localStorage.getItem('domains'))
      }
    },
    onClick(email) {
      setTimeout(() => {
        this.$router.push({ path: `/?domain=${email}` })
      }, 1000)
    },
  },
}
</script>

<style lang="scss" scoped></style>
