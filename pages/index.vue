<template>
  <v-layout justify-center align-center>
    <v-flex xs12 sm8 md6>
      <v-card>
        <v-card-title class="headline py-2">
          Email Finder
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="blue" small v-bind="attrs" v-on="on"
                >mdi-help-circle-outline</v-icon
              >
            </template>
            <span class="py-6">
              The Domain Search provides functionality which helps you find all
              email addresses from a given domain. (for example, "tomba.io"). 💡
            </span>
          </v-tooltip>
        </v-card-title>
        <v-form ref="form" @submit.prevent="submitForm">
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" offset-sm="3">
                <v-text-field
                  v-model="domain"
                  placeholder="company.com"
                  label="Domain"
                  required
                  :rules="domainRules"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6" offset-sm="3">
                <v-btn type="submit" color="primary">
                  <v-icon left> mdi-email-search</v-icon>Find email addresses
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card>
      <v-skeleton-loader v-if="load" type="card"></v-skeleton-loader>
      <br />
      <finder v-if="show" :data="data" />
    </v-flex>
    <v-snackbar v-model="snackbar">
      {{ text }}

      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      domain: '',
      domainRules: [
        (value) => !!value || 'Domain is required',
        (value) =>
          /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test(
            value
          ) || 'Invalid domain',
      ],
      show: false,
      load: false,
      data: null,
      account: JSON.parse(localStorage.getItem('account')),
      snackbar: false,
      text: `Connect to Find emails.`,
    }
  },
  computed: {
    key() {
      return this.$store.getters.key
    },
    secret() {
      return this.$store.getters.secret
    },
    domains() {
      return this.$store.getters.domains
    },
  },
  mounted() {
    if (this.$route.query.domain) {
      this.domain = this.$route.query.domain
    }
    this.loadState()
  },
  methods: {
    loadState() {
      if (localStorage.getItem('key')) {
        this.$store.commit('setKey', localStorage.getItem('key'))
      }
      if (localStorage.getItem('secret')) {
        this.$store.commit('setSecret', localStorage.getItem('secret'))
      }
      if (localStorage.getItem('account')) {
        this.$store.commit('setAccount', localStorage.getItem('account'))
      }
      if (localStorage.getItem('domains')) {
        this.$store.commit('loadJSON', localStorage.getItem('domains'))
      }
    },
    saveState() {
      localStorage.setItem('domains', this.$store.getters.toJSON)
    },
    checkDomain(domain) {
      const foundDomain = this.domains.find(
        (entry) => entry.data.organization.website_url === domain
      )
      return foundDomain
    },
    submitForm() {
      if (this.$refs.form.validate()) {
        this.load = true
        if (!this.account) {
          this.load = false
          this.snackbar = true
          setTimeout(() => {
            this.$router.push({ path: '/connection' })
          }, 1000)
        } else if (this.checkDomain(this.domain)) {
          this.load = false
          this.show = true
          this.data = this.checkDomain(this.domain)
        } else {
          // Form is valid, you can perform further actions here
          const TombaInstance = (key, secret) =>
            this.$axios.create({
              baseURL: 'https://api.tomba.io/v1',
              headers: {
                'X-Tomba-Key': key,
                'X-Tomba-Secret': secret,
                'X-Tomba-Origin': 'extension',
              },
            })
          TombaInstance(this.key, this.secret)
            .$get(`/domain-search?domain=${this.domain}`)
            .then((rest) => {
              this.data = rest
              console.log(this.data)
              this.load = false
              this.show = true
              this.$store.commit('addDomains', this.data)
              this.saveState()
            })
            .catch((err) => {
              console.log(err)
              this.load = false
            })
        }
      }
    },
  },
}
</script>
