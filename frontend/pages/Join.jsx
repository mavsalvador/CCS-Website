import React from 'react';
import '../styles/index.css';
import { Header } from "../components/Header.jsx"
import instagram_1 from "../assets/instagram_1.jpeg"
import instagram_2 from "../assets/instagram_2.jpeg"
import merchPic from "../assets/merchModels.jpg"

function handleSubscribe (e){
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  const email = formData.getAll('email');
  console.log(email)
}

export const Join = () => {
  return (
    <div>
        <Header title="Our Community" subtitle="Become part of CCS today"/>
        <section className="bg-[#f2e8d5] h-auto px-6 py-10">
          <hr className="gradient-line" />
          <h2 className="p-4 text-center headers !text-2xl">◇ Connect with Us ◇</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[1440px] mx-auto p-4'>
            <div className='max-w-[800px] my-5 p-8 bg-[#ede2c9] shadow-sm border-1 border-[#dcb377cf]'>
                <div class="flex items-center gap-3 text-[#7d1c1c] mb-4">
                  <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                  <h2 class="nice-font !text-3xl !font-medium">Follow our Instagram</h2>
                </div>
                <p class="text-[#554433] text-base mb-6 leading-relaxed">
                  Stay connected with event updates, photos, and cultural content.
                </p>
                <a href="https://www.instagram.com/ccsofnd/" className="block simple-font !text-center !text-white text-sm !font-bold tracking-wider py-3.5 mb-6 bg-gradient-to-r from-[#7000ff] to-[#d10080] rounded-lg transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-xl hover:border-[#c9a227]">
                  @CCSOFND
                </a>
                <div class="grid grid-cols-2 gap-4">
                  <div class="overflow-hidden group relative overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-xl">
                    <img src={instagram_1} alt="Chinese Lanterns" className="w-full h-20 sm:h-30 md:h-40 object-cover transition-transform duration-300 ease-out group-hover:scale-110"/>
                  </div>
                  <div class="overflow-hidden group relative overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-xl">
                    <img src={instagram_2} alt="Chinese Deity Lantern" class="w-full h-20 sm:h-30 md:h-40 object-cover transition-transform duration-300 ease-out group-hover:scale-110"/>
                  </div>
                </div>
            </div>
            <div className='max-w-[900px] my-5 p-8 bg-[#ede2c9] shadow-sm border-1 border-[#dcb377cf]'>
               <div class="flex items-center gap-3 text-[#7d1c1c] mb-4">
                <h2 class="nice-font !text-3xl !font-medium">Join our Group Me</h2>
               </div>
                <p class="text-[#554433] text-base mb-6 leading-relaxed">
                  Get real-time updates, chat with members, and stay informed
                </p>
                <a href="https://groupme.com/join_group/116966556/gpefgxOe" class="block simple-font !text-center !text-white text-sm !font-normal tracking-wider py-3.5 mb-6 bg-[#9a2d24] rounded-lg transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-xl hover:border-[#c9a227]">
                  JOIN OUR GROUPME CHAT
                </a>
                <div className="bg-[#f2e8d5] border-1 border-[#dcb377cf]">
                    <ul className="text-[#554433] text-base !text-md ml-4 mt-4 mb-4 p-2 leading-relaxed space-y-2">
                      <li> <span className="text-[#9a2d24] select-none">♦</span> 100+ other members</li>
                      <li> <span className="text-[#9a2d24] select-none">♦</span> Get reminders</li>
                      <li> <span className="text-[#9a2d24] select-none">♦</span> Stay in the loop</li>
                    </ul>
                </div>
            </div>
          </div>
        </section>
        <hr className="gradient-line" />
        <section className="bg-[#f2e8d5] h-auto px-6 py-10">
          <div className='max-w-[1440px] mx-auto p-4'>
            <div className='w-full p-8 bg-[#ede2c9] shadow-sm border-1 border-[#dcb377cf]'>
              <div class="flex flex-col items-center justify-center gap-3 text-[#7d1c1c] mb-4">
                    <h2 class="nice-font !text-3xl !font-medium m-3 mb-5">⛂⛃ Membership Dues ⛃⛂</h2>
                    <div className="bg-[#f2e8d5] border-1 border-[#dcb377cf] w-1/2 text-center p-8">
                      <h2 class="nice-font !text-6xl !font-medium">$10</h2>
                      <p class="text-[#554433] text-base mt-6 leading-relaxed">
                        Annual Membership or $5/semester
                      </p>
                   </div>
                   <div className="w-1/2">
                        <ul className="text-[#554433] text-base !text-md ml-4 mt-4 mb-4 p-2 leading-relaxed space-y-2">
                          <li> <span className="text-[#9a2d24] select-none">♦</span> Access to all club events and activities</li>
                          <li> <span className="text-[#9a2d24] select-none">♦</span> Reduced event fees </li>
                          <li> <span className="text-[#9a2d24] select-none">♦</span> Help support the club</li>
                          <li> ...and more!</li>
                        </ul>
                  </div>
                   <a href="https://shop.nd.edu:443/C21688_ustores/web/product_detail.jsp?PRODUCTID=14052&SINGLESTORE=true" class="w-1/2 block simple-font !text-center !text-white text-sm !font-normal tracking-wider py-3.5 mb-6 bg-[#9a2d24] rounded-lg transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-xl hover:border-[#c9a227]">
                      PAY DUES
                    </a>
              </div>
            </div>
          </div>
        </section>
        <hr className="gradient-line" />
        <section className="bg-[#f2e8d5] h-auto px-6 py-10">
          <div className='max-w-[1440px] mx-auto p-4'>
            
            <div className="ccs-merch-card group">
              <div className="ccs-merch-visual">
                <div className="ccs-merch-image-wrap ">
                  <img
                    src={merchPic}
                    alt="cutie patooties wearing our merch"
                    className="ccs-merch-image w-full h-60 sm:h-85 md:h-100 object-cover -mt-5"
                  />
                </div>
              </div>

              <div className="ccs-merch-copy">
                <div className="ccs-merch-kicker simple-font">
                  25-26
                </div>
                <h2 className="nice-font ccs-merch-title">CCS Merchandise</h2>
                <p className="ccs-merch-description simple-font">
                  CCS is currently selling an embroidered white and blue sweatshirt, perfect for any event. Look out for new merchandise in the upcoming shcool year!
                </p>
                <ul className="ccs-merch-list !list-none simple-font">
                  <li><span className="text-[#9a2d24] select-none">♦</span> Elegant embroidery and design</li>
                  <li><span className="text-[#9a2d24] select-none">♦</span> Show your support for CCS! </li>
                </ul>
                <a
                  href="https://shop.nd.edu/C21688_ustores/web/store_cat.jsp?STOREID=8&SINGLESTORE=true&CATID=988&utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQPOTM2NjE5NzQzMzkyNDU5AAGnV4kTh8n1-q39zV7Elf6--7PMk0FEzsO4SvpKpM_g4wdLbDUtviHDWMoj-wM_aem_Wx9tG1N4mNfCTqcJMqjTQw"
                  className="ccs-merch-button simple-font"
                >
                  Purchase Online
                </a>
              </div>
            </div>
            
          </div>
        </section>
    </div>
  );
};
