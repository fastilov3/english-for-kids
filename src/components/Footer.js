import Categories from '../cards';
import RSSchoolLogo from './../img/rs-school.svg';

let getCategoriesList = async() => {
  return Categories;
};

let Footer = {
    render: async() => {
        let categories = await getCategoriesList();

        return /*html*/ `<footer class="page-footer">
        <div class="container">
            <div class="row">
              <div class="col l4">
                <h5 class="white-text">English For Kids</h5>
                <p class="grey-text text-lighten-4">The application was developed as part of the course: <a class="grey-text text-lighten-4 underline-text" href="https://rs.school/js/" target="_blank">"JavaScript/Front-end" from RS School</a></p>
                <a class="rs-school-footer-logo" href="https://rs.school/js/" target="_blank">
                    ${RSSchoolLogo}
                </a>
                </div>
              <div class="col l6 offset-l2">
                <h5 class="white-text">Categories</h5>
                <ul class="categories-footer-grid">
                    ${categories
                      .map(
                        (category) =>
                          `<li><a class="grey-text text-lighten-3" href="#/category/${category.id}">${category.title}</a></li>`,
                      )
                      .join('\n ')}
                </ul>
              </div>
            </div>
        </div>
        <div class="footer-copyright">
            <div class="container">
                © ${new Date().getFullYear()} Develop by <a class="grey-text text-lighten-4 underline-text" href="https://github.com/fastilov3" target="_blank">fastilov3</a>
                <a class="grey-text text-lighten-4 right" href="#/">Home</a>
            </div>
        </div>
    </footer>`;
  },
  after_render: async () => {},
};

export default Footer;