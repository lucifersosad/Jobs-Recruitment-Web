import { decData } from "../../../../helpers/decData";
import { FormatTree } from "../../../../helpers/selectTree";
import { getJobAdvancedSearch } from "../../../../services/clients/jobsApi";
import { getAllJobsCategories } from "../../../../services/clients/jobsCategoriesApi";

export const fetchApi = async (optionCategories, setOptionCategories, setRecordItem, page, limit, sort_key, sort_value, keyword, job_categorie_group, job_categorie, job_type, job_level, salary_min, salary_max,city,workExperience,setCoutJob, setLoading) => {
    setLoading(true)

    const new_job_categorie = job_categorie_group ? job_categorie_group.concat(",", job_categorie) : job_categorie
  
    const [resultgetAllJobsCategoriesTree, resultgetJobAdvancedSearch] = await Promise.all([
      // getAllJobsCategories(),
      optionCategories?.length === 0 && getAllJobsCategories("", "", "", "", true),
      getJobAdvancedSearch(page, limit, sort_key, sort_value, keyword, new_job_categorie, job_type, job_level, salary_min, salary_max,city,workExperience)
    ]);
  
    // if (resultgetAllJobsCategories.code === 200) {
    //   console.log("🚀 ~ fetchApi ~ resultgetAllJobsCategories:", resultgetAllJobsCategories)
    //   setCategories(resultgetAllJobsCategories.data);
    // }

    if (optionCategories?.length === 0  && resultgetAllJobsCategoriesTree.code === 200) {
      const convertData = FormatTree(resultgetAllJobsCategoriesTree.data)
      setOptionCategories(convertData);
    }
  
    if (resultgetJobAdvancedSearch.code === 200) {
        
     
      const convertDataRecord = decData(resultgetJobAdvancedSearch.data);
      setCoutJob(resultgetJobAdvancedSearch.countJobs);

      setRecordItem(convertDataRecord);

      setLoading(false)
    }
  }
  
  