<template>
  <div>
    <div class="row">
      <div class="col-12 col-md-6">
        <div class="backdrop mb-4">
          <img src="@/assets/img/logo_dark.svg" style="width:240px;margin-top:-20px;" alt="" />
          <div>
{{$t('pages.about_part_1')}}
          </div>
           
        </div>
      </div>
      <div class="col-12 col-md-6">
        <div class="backdrop mb-4">
          <div>
               {{$t('pages.about_part_2')}}
          </div>
       
        </div>
      </div>
    </div>
    <infoBlock />
  </div>
</template>

<script>
import infoBlock from "../home/home-info-block.vue";
export default {
  props: ["page"],
  components: {
    infoBlock,
  },
};
</script>

<style lang="scss" scoped>
.backdrop {
  background: linear-gradient(
    68.83deg,
    rgba(27, 193, 161, 0.2) 10.18%,
    rgba(148, 148, 148, 0.074) 98.93%
  );
  backdrop-filter: blur(20px);
  border-radius: 0px 100px;
  padding: 30px 30px 80px 30px;
  height: 100%;
}
</style>
