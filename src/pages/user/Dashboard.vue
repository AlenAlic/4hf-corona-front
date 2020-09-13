<template>
  <v-container class="pt-0">
    <v-row justify="center">
      <v-col cols="12" xl="4" lg="6" md="12">
        <v-card>
          <v-card-title>
            {{ $t("general.classes") }}
            <v-spacer />
            <v-text-field
              v-model="searchClasses"
              append-icon="mdi-magnify"
              :label="$t('general.search')"
              single-line
              hide-details
            ></v-text-field>
            <v-spacer />
          </v-card-title>
          <v-data-table
            :headers="headersClasses"
            :items="classes"
            :loading="$store.state.classes.loading"
            :search="searchClasses"
            hide-default-footer
            :items-per-page="classes.length"
          >
            <template v-slot:item.action="{ item }">
              <v-btn icon :to="{ name: 'class', params: { id: item.id } }">
                <v-icon>
                  mdi-eye
                </v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
      <v-col cols="12" xl="4" lg="6" md="12">
        <v-card>
          <v-card-title>
            {{ $t("general.people") }}
            <v-spacer />
            <v-text-field
              v-model="searchPeople"
              append-icon="mdi-magnify"
              :label="$t('general.search')"
              single-line
              hide-details
            ></v-text-field>
            <v-spacer />
          </v-card-title>
          <v-data-table
            :headers="headersPeople"
            :items="$store.state.people.people"
            :loading="$store.state.people.loading"
            :search="searchPeople"
            hide-default-footer
            :items-per-page="$store.state.people.people.length"
          >
          </v-data-table>
        </v-card>
      </v-col>
      <v-col cols="12" xl="4" lg="6" md="12">
        <v-card>
          <v-card-title>
            {{ $t("general.couples") }}
            <v-spacer />
            <v-text-field
              v-model="searchCouples"
              append-icon="mdi-magnify"
              :label="$t('general.search')"
              single-line
              hide-details
            ></v-text-field>
            <v-spacer />
          </v-card-title>
          <v-data-table
            :headers="headersCouple"
            :items="$store.state.couples.couples"
            :loading="$store.state.couples.loading"
            :search="searchCouples"
            hide-default-footer
            :items-per-page="$store.state.couples.couples.length"
          >
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import i18n from "@/languages";
import { CLASSES } from "@/store/modules/classes";
import { PEOPLE } from "@/store/modules/people";
import { COUPLES } from "@/store/modules/couples";

export default {
  data() {
    return {
      searchClasses: "",
      searchPeople: "",
      searchCouples: ""
    };
  },
  created() {
    this.$store.dispatch(CLASSES);
    this.$store.dispatch(PEOPLE);
    this.$store.dispatch(COUPLES);
  },
  computed: {
    classes() {
      return this.$store.state.classes.classes.map(c => {
        const dt = this.$util.dateTime(c.datetime);
        return Object.assign(c, {
          date: dt.toFormat("dd-LL-yyyy HH:mm"),
          day: dt.toFormat("EEEE")
        });
      });
    },
    headersClasses() {
      return [
        {
          text: i18n.t("classes.headers.name"),
          value: "name"
        },
        {
          text: i18n.t("classes.headers.day"),
          value: "day"
        },
        {
          text: i18n.t("classes.headers.date"),
          value: "date"
        },
        {
          value: "action",
          align: "right"
        }
      ];
    },
    headersPeople() {
      return [
        {
          text: i18n.t("people.headers.full_name"),
          value: "full_name"
        },
        {
          text: i18n.t("people.headers.email"),
          value: "email"
        },
        {
          text: i18n.t("people.headers.student_number"),
          value: "student_number"
        },
        {
          value: "action",
          align: "right"
        }
      ];
    },
    headersCouple() {
      return [
        {
          text: i18n.t("couple.headers.lead"),
          value: "lead.full_name"
        },
        {
          text: i18n.t("couple.headers.follow"),
          value: "follow.full_name"
        }
      ];
    }
  }
};
</script>
