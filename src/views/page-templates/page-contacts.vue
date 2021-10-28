<template>
  <div class="to-contacts">
    <div class="backdrop mb-4">
      <div
        v-html="page.description"
        class="bg"
        :style="{
          backgroundImage:
            'url(' + require('@/assets/img/contacts-bg.png') + ')',
        }"
      ></div>
    </div>
    <div class="row align-items-center">
      <div class="col-12 col-md-4">
        <div class="map-text">
          <h4 class="uppercase">
            {{ $t("pages.contacts_line_1") }}
          </h4>
          <a href="tel:+380931776011"><strong>093 177 60 11</strong></a>

          <h4 class="mt-4 uppercase">{{ $t("pages.central_office") }}:</h4>
          <h4>
            <strong>{{ $t("pages.city_address") }} </strong>
          </h4>
          <p>
            <strong> {{ $t("pages.street_address") }}</strong>
          </p>
        </div>
      </div>
      <div class="col-12 col-md-8">
        <div class="map-wrapper">
          <GmapMap
            :options="mapStyle"
            :center="{ lat: 50.451723821164784, lng: 30.527486403004975 }"
            :zoom="13"
            map-type-id="terrain"
            style="width: 700px; height: 300px"
          >
            <GmapMarker
              :key="index"
              :position="{ lat: 50.451723821164784, lng: 30.527486403004975 }"
              @click="
                center = { lat: 50.451723821164784, lng: 30.527486403004975 }
              "
            />
          </GmapMap>
        </div>
      </div>
    </div>
    <div class="home__mail-us">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div
              class="d-flex py-4 my-4 flex-column flex-md-row align-items-center justify-content-center"
            >
              <h5>{{ $t("labels.still_have_questions") }}?</h5>
              <b-button
                href="mailto:support@together.biz.ua"
                variant="primary"
                class="mt-2 mt-md-0 ml-md-4 d-flex align-items-center justify-content-center"
              >
                {{ $t("buttons.contact_us") }}
              </b-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["page"],
  data() {
    return {
      mapStyle: {
        styles: [
          {
            featureType: "all",
            elementType: "labels.text.fill",
            stylers: [
              {
                saturation: 36,
              },
              {
                color: "#333333",
              },
              {
                lightness: 40,
              },
            ],
          },
          {
            featureType: "all",
            elementType: "labels.text.stroke",
            stylers: [
              {
                visibility: "on",
              },
              {
                color: "#ffffff",
              },
              {
                lightness: 16,
              },
            ],
          },
          {
            featureType: "all",
            elementType: "labels.icon",
            stylers: [
              {
                visibility: "off",
              },
            ],
          },
          {
            featureType: "administrative",
            elementType: "geometry.fill",
            stylers: [
              {
                color: "#fefefe",
              },
              {
                lightness: 20,
              },
            ],
          },
          {
            featureType: "administrative",
            elementType: "geometry.stroke",
            stylers: [
              {
                color: "#fefefe",
              },
              {
                lightness: 17,
              },
              {
                weight: 1.2,
              },
            ],
          },
          {
            featureType: "administrative.country",
            elementType: "geometry.fill",
            stylers: [
              {
                lightness: "-43",
              },
            ],
          },
          {
            featureType: "landscape",
            elementType: "geometry",
            stylers: [
              {
                color: "#ffffff",
              },
              {
                lightness: 20,
              },
            ],
          },
          {
            featureType: "landscape.natural.terrain",
            elementType: "geometry.fill",
            stylers: [
              {
                lightness: "70",
              },
              {
                saturation: "46",
              },
            ],
          },
          {
            featureType: "poi",
            elementType: "geometry",
            stylers: [
              {
                color: "#f1f1f1",
              },
              {
                lightness: 21,
              },
            ],
          },
          {
            featureType: "road.highway",
            elementType: "geometry.fill",
            stylers: [
              {
                color: "#dedede",
              },
              {
                lightness: 17,
              },
            ],
          },
          {
            featureType: "road.highway",
            elementType: "geometry.stroke",
            stylers: [
              {
                color: "#dedede",
              },
              {
                lightness: 29,
              },
              {
                weight: 0.2,
              },
            ],
          },
          {
            featureType: "road.arterial",
            elementType: "geometry",
            stylers: [
              {
                color: "#dedede",
              },
              {
                lightness: 18,
              },
            ],
          },
          {
            featureType: "road.local",
            elementType: "geometry",
            stylers: [
              {
                color: "#ffffff",
              },
              {
                lightness: 16,
              },
            ],
          },
          {
            featureType: "transit",
            elementType: "geometry",
            stylers: [
              {
                color: "#f2f2f2",
              },
              {
                lightness: 19,
              },
            ],
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [
              {
                color: "#a0d6d1",
              },
              {
                lightness: 17,
              },
            ],
          },
          {
            featureType: "water",
            elementType: "geometry.fill",
            stylers: [
              {
                saturation: "21",
              },
              {
                lightness: "-52",
              },
              {
                gamma: "1.63",
              },
            ],
          },
        ],
      },
    };
  },
  components: {},
  methods: {
    htmlEntities(str) {
      return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    },
  },
};
</script>

<style lang="scss">
.to-contacts {
  a {
    color: #000;
    font-size: 18px;
    transition: color .5s linear;
    &:hover {
      text-decoration: none;
      color: var(--primary-color);

    }
  }
}
.home {
  &__mail-us {
    padding: 80px 0px;
    h5 {
      font-weight: normal;
      font-size: 34px;
      margin-bottom: 0;
    }
  }
}
.map-text {
  .uppercase {
    text-transform: uppercase;
  }
  strong {
    font-weight: 600;
  }
}
.backdrop {
  background: linear-gradient(
    68.83deg,
    rgba(27, 193, 161, 0.2) 10.18%,
    rgba(148, 148, 148, 0.074) 98.93%
  );
  backdrop-filter: blur(20px);
  border-radius: 0px 100px;
  padding: 30px;

  .bg {
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    min-height: 200px;
    padding: 0px 60px;
    @media(max-width:768px){
      padding:0px 0px;
    }
    .col-12 {
      padding-bottom: 20px;
    }
    h4 {
      text-transform: uppercase !important;
      font-size: 18px;

      strong {
        font-weight: 600;
      }
    }
    ul {
      margin: 0;
      padding: 0;
      margin-bottom: 20px;
      li {
        list-style: none;
        display: flex;
        justify-content: space-between;
        min-width: 100%;
      }
    }
  }
}
.map-wrapper {
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  border-radius: 0px 100px;
  overflow: hidden;
  .vue-map-container {
    width:100%!important;
    min-width: 100%!important;
  }
}
</style>
