<template>
  <div id="main">
      <header-el></header-el>
      <router-view/>
      <div class="container-fluid">
            <div id="footer">
                 Enjoy the site? <strong>Donate :)</strong>
                 <ul class="list-inline">
                       <li>BTC: <strong>1AWscZLKScE1ZVE2ws8uddbwr6mXNp7tWr</strong> </li>
                       <li>BCH: <strong>1Lx1WirnxnGwcSsHi8UYLAbNJgUMMCjpek</strong> </li>
                       <li>ETH: <strong>0x0F7b60159Bf75890708151Ba4Caa34E629342f25</strong> </li>
                       <li>LTC: <strong>LU8PWgixnewxKK5MKyitXx2xraX2kU4jJP</strong> </li>
                 </ul>
            </div>
      </div>
  </div>
</template>

<script>

      // import the header and home components 
      import HeaderEl from '@/components/Header'
      import Home from '@/components/Home'

      export default {
            components: {
                  HeaderEl,
                  Home
            },
      }

</script>
