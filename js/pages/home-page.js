import homePageHeader from '../cmps/home-page-header.js';

export default {
    template: `
    <section class="home-page" :style="{backgroundImage:changeBg}">
    <home-page-header />
    <div class="main-container">
        <h1 class="main-title">
        AppSuss
        </h1>
        <h2>Your World Inside a Screen</h2>
        <div class="apps-menu">
            <router-link to="/book">
                <div class="app-card">
                    <h2 class="app-title">Books</h2>
                    <img class="app-logo" src="img/book.png" alt="">
                </div>
            </router-link>
            <router-link to="/mail/inbox">
                <div class="app-card">
                    <h2 class="app-title">Mails</h2>
                    <img class="app-logo mail-logo" src="img/gmail.png" alt="">
                </div>
            </router-link>
            <router-link to="/keep">
                <div class="app-card">
                    <h2 class="app-title">Keeps</h2>
                    <img class="app-logo keep-logo" src="img/keep.png" alt="">
                </div>
            </router-link>
        </div>
    </div>
    <footer>CoffeeRights</footer>
    </section>
    `,
    components: {
        homePageHeader
    },
    data(){
        return {
            interval : null,
            imgUrl : 1
        }
    },
    computed: {
        changeBg(){
            if(this.imgUrl === 1) return 'url("img/bg/bg-img1.webp")';
            return 'url("img/bg/bg-img5.webp")';
        }
    },
    created(){
        this.interval = setInterval(()=>{
            // this.changeBg();
            this.imgUrl++ ;
            if(this.imgUrl > 2) this.imgUrl = 1;
        },10000)
    },
    destroyed(){
        clearInterval(this.interval);
    }
};
