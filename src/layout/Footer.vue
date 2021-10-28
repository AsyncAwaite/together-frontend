<template>
  <footer class="footer mt-4">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <div class="text-center mb-1">
            <a
              href="https://facebook.com"
              target="_blank"
              class="d-inline-block p-2"
            >
              <img src="@/assets/img/fb.png" alt="" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              class="d-inline-block p-2"
            >
              <img src="@/assets/img/youtube.png" alt="" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              class="d-inline-block p-2"
            >
              <img src="@/assets/img/ig.png" alt="" />
            </a>
          </div>

          <ul class="text-center m-0 p-0 mt-4">
            <li>
              <router-link
                :to="{
                  name: 'page',
                  params: { slug: 'pravila-koristuvannya-saitom' },
                }"
              >
               {{$t('pages.page_rules_title')}}
              </router-link>
            </li>
            <li>
              <router-link
                :to="{
                  name: 'page',
                  params: { slug: 'politika-konfidenciinosti' },
                }"
              >
                {{$t('pages.page_policy_title')}}
              </router-link>
            </li>
            <li>
              <router-link
                :to="{
                  name: 'page',
                  params: { slug: 'publicna-oferta' },
                }"
              >
                {{$t('pages.page_offer_title')}}
              </router-link>
            </li>
            <li>
              <router-link
                :to="{
                  name: 'page',
                  params: { slug: 'delivery-payment'},
                }"
              >
               {{$t('pages.page_delivery_title')}}
              </router-link>
            </li>
                <li>
              <router-link
                :to="{
                  name: 'page',
                  params: { slug: 'return-exchange' },
                }"
              >
               {{$t('pages.page_return_title')}}
              </router-link>
            </li>
          </ul>
          <div class="text-center copyright mt-4">
            © Together 2021. We love our users!
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {

};
</script>

<style lang="scss">
.footer {
  background: #2b2d2d;
  padding: 60px 0px;
  .copyright {
    color: #e7e7e7;
    font-size: 13px;
  }
  a {
    img {
      transition: 0.3s;
    }
    &:hover {
      img {
        transform: scale(1.2);
        transition: 0.3s;
      }
    }
  }
}
</style>
