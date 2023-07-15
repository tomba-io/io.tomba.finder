<template>
  <v-container fluid>
    <v-row v-if="data.data.emails.length > 0" justify="center">
      <v-col>
        <v-card>
          <v-card-text>
            <strong>Results {{ data.meta.total }}</strong>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon small v-bind="attrs" v-on="on">
                  mdi-help-circle-outline
                </v-icon>
              </template>
              <span class="py-6">
                Total email addresses we have for the domain.
              </span>
            </v-tooltip>
            <v-btn
              @click="downloadCSV()"
              class="mx-2"
              fab
              dark
              small
              color="primary"
            >
              <v-icon dark> mdi-download </v-icon>
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
      <v-expansion-panels popout>
        <v-expansion-panel v-for="(email, i) in data.data.emails" :key="i">
          <v-expansion-panel-header>
            <v-row align="center" class="spacer" no-gutters>
              <v-col cols="4" sm="2" md="1">
                <v-avatar size="36px">
                  <img
                    :src="`https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${data.data.organization.website_url}&size=16`"
                    alt=""
                  />
                </v-avatar>
              </v-col>

              <v-col class="hidden-xs-only" sm="5" md="3">
                <strong> {{ email.email }} </strong>
                <!-- <span v-if="message.total" class="grey--text">
                  &nbsp;({{ message.total }})
                </span> -->
              </v-col>

              <v-col class="text-no-wrap" cols="5" sm="3">
                <strong v-html="email.full_name"></strong>
              </v-col>

              <v-col
                v-if="email.position"
                class="grey--text text-truncate hidden-sm-and-down"
              >
                &mdash;
                {{ email.position }}
              </v-col>
            </v-row>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-divider></v-divider>
            <v-col v-if="email.sources.length > 0" cols="12">
              We found
              <strong>
                {{ email.sources ? email.sources.length : 0 }} sources
              </strong>
              for <strong>{{ email.email }}</strong> on the web.
              <br />
              <v-list subheader two-line>
                <v-list-item v-for="(source, key) in email.sources" :key="key">
                  <v-list-item-content>
                    <v-list-item-title v-text="source.uri"></v-list-item-title>
                    <v-list-item-subtitle
                      v-text="source.extracted_on"
                    ></v-list-item-subtitle>
                  </v-list-item-content>

                  <v-list-item-action>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          icon
                          v-bind="attrs"
                          @click="onClick(source.uri)"
                          v-on="on"
                        >
                          <v-icon color="grey lighten-1">mdi-eye</v-icon>
                        </v-btn>
                      </template>
                      <span class="py-6"> open url </span>
                    </v-tooltip>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-col>
            <v-col v-else>
              <strong>
                We couldn't find this email address publicly available on the
                web.
              </strong>
            </v-col>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-row>
    <v-row v-else justify="center">
      <v-card>
        <!-- <v-img :src="image"></v-img> -->
        <v-card-title>No Result, yet.</v-card-title>
        <v-card-text>
          <span data-v-276b5e4e="">
            TombaPublicWebCrawler is searching the internet for the best leads
            that relate to this company, but we don't have any for it yet. That
            said, we're working on it.
            <a
              href="https://help.tomba.io/en/questions/reasons-why-domain-search-don-t-find-any-emails/?utm_source=app&amp;utm_medium=app&amp;utm_campaign=app&amp;utm_content=help_action"
              target="_blank"
            >
              Why?
            </a>
          </span>
        </v-card-text>
      </v-card>
    </v-row>
  </v-container>
</template>
<script>
export default {
  props: {
    // eslint-disable-next-line vue/require-default-prop
    data: {
      type: Object,
      require: true,
    },
  },
  data() {
    return {}
  },
  methods: {
    onClick(uri) {
      window.open(uri, '_blank')
    },
    copyText() {
      alert('Text copied!')
    },
    downloadCSV() {
      const csvContent =
        'data:text/csv;charset=utf-8,' +
        this.convertToCSV(this.data.data.emails)
      const encodedUri = encodeURI(csvContent)
      const link = document.createElement('a')
      link.setAttribute('href', encodedUri)
      link.setAttribute(
        'download',
        `${this.data.data.organization.website_url}.csv`
      )
      document.body.appendChild(link) // Required for Firefox
      link.click()
      document.body.removeChild(link)
    },
    convertToCSV(data) {
      const headers = Object.keys(data[0])
      const rows = data.map((obj) => headers.map((header) => obj[header]))
      const headerRow = headers.join(',')
      const dataRows = rows.map((row) => row.join(','))
      return [headerRow, ...dataRows].join('\n')
    },
  },
}
</script>
<style>
.vgreen {
  color: #52c41a;
}
.dark-orange {
  color: #ff572b;
}
.vred {
  color: #ef1d1d;
}
.right {
  float: right;
}
</style>
